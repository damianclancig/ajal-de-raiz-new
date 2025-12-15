'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import { getDb } from '@/lib/product-service'; // Using shared service
import { auth } from '@/auth';
import { getOrderById, getPendingPaymentOrdersCount as getPendingOrdersService } from '@/lib/order-service';
import { createPreference } from '@/lib/mercadopago-service';
import { getCurrentUser } from '@/lib/user-service';
import { sendNewOrderNotification, sendReceiptSubmittedNotification } from '@/lib/email-service';
import { getPopulatedCart } from './cart'; // Importing from sibling module
import type { ActionResponse, PaymentMethod, OrderItem, OrderStatus, Cart } from '@/lib/types';


export async function createOrder(paymentMethod: PaymentMethod): Promise<ActionResponse> {
    const session = await auth();
    const user = await getCurrentUser();
    if (!session?.user?.id || !user) {
        return { success: false, message: "User not authenticated." };
    }

    const db = await getDb();
    const cartsCollection = db.collection<Cart>('carts');
    const productsCollection = db.collection('products');
    const ordersCollection = db.collection('orders');

    const userId = new ObjectId(session.user.id);
    const cart = await getPopulatedCart(session.user.id);

    if (!cart || cart.items.length === 0) {
        return { success: false, message: "El carrito está vacío." };
    }

    const orderItems: OrderItem[] = cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
    }));

    let initialStatus: OrderStatus = 'Pendiente';
    if (paymentMethod === 'Transferencia Bancaria' || paymentMethod === 'MercadoPago') {
        initialStatus = 'Pendiente de Pago';
    }

    // For MercadoPago, we create the preference first.
    if (paymentMethod === 'MercadoPago') {
        try {
            // Step 1: Create the order in DB to get an ID
            const orderToInsert = {
                userId: userId,
                items: orderItems,
                totalPrice: cart.totalPrice,
                paymentMethod: paymentMethod,
                status: initialStatus,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const orderResult = await ordersCollection.insertOne(orderToInsert);
            const orderId = orderResult.insertedId;

            // Step 2: Create MP preference with the real order ID
            const preference = await createPreference({
                id: orderId.toString(),
                items: orderItems,
                user: user,
            });

            // Step 3: Update the order with the preference details
            await ordersCollection.updateOne(
                { _id: orderId },
                {
                    $set: {
                        mercadoPagoPreferenceId: preference.id,
                        mercadoPagoInitPoint: preference.init_point
                    }
                }
            );

            // Step 4: Decrease stock
            for (const item of cart.items) {
                await productsCollection.updateOne(
                    { _id: new ObjectId(item.productId) },
                    { $inc: { countInStock: -item.quantity } }
                );
            }

            // Step 5: Clear cart
            await cartsCollection.deleteOne({ userId });

            // Step 6: Send notifications
            const newOrder = await getOrderById(orderId.toString());
            if (newOrder) {
                await sendNewOrderNotification(newOrder, user);
            }

            revalidatePath('/cart');
            revalidatePath('/orders');

            return { success: true, message: "Order created, redirecting to payment.", init_point: preference.init_point };

        } catch (error) {
            console.error("Failed to create MercadoPago preference or order:", error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred with MercadoPago.';
            // We don't create the order if the preference fails. The flow stops here.
            return { success: false, message: `No se pudo generar el enlace de pago: ${message}` };
        }
    }

    // --- Flow for other payment methods (Cash, Bank Transfer) ---
    try {
        const orderToInsert = {
            userId: userId,
            items: orderItems,
            totalPrice: cart.totalPrice,
            paymentMethod: paymentMethod,
            status: initialStatus,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await ordersCollection.insertOne(orderToInsert);
        const orderId = result.insertedId;

        for (const item of cart.items) {
            await productsCollection.updateOne(
                { _id: new ObjectId(item.productId) },
                { $inc: { countInStock: -item.quantity } }
            );
        }

        await cartsCollection.deleteOne({ userId });

        const newOrder = await getOrderById(orderId.toString());
        if (newOrder) {
            await sendNewOrderNotification(newOrder, user);
        }

        revalidatePath('/cart');
        revalidatePath('/orders');

        return { success: true, message: "Order created successfully." };

    } catch (error) {
        console.error("Critical error during order creation:", error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to create order: ${message}` };
    }
}


export async function updateOrderStatus(orderId: string, formData: FormData): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        return { success: false, message: "User not authorized." };
    }

    const status = formData.get('status') as OrderStatus;
    if (!['Pendiente', 'Pendiente de Pago', 'Pendiente de Confirmación', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'].includes(status)) {
        return { success: false, message: "Invalid status." };
    }

    try {
        const db = await getDb();
        const ordersCollection = db.collection('orders');

        const result = await ordersCollection.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status: status, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: "Order not found." };
        }

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update order status: ${message}` };
    }

    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${orderId}`);
    redirect(`/admin/orders`);
}

export async function submitReceipt(orderId: string, receiptUrl: string): Promise<ActionResponse> {
    const session = await auth();
    const user = await getCurrentUser();
    if (!session?.user?.id || !user) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const db = await getDb();
        const ordersCollection = db.collection('orders');

        const result = await ordersCollection.findOneAndUpdate(
            { _id: new ObjectId(orderId), userId: new ObjectId(session.user.id) },
            {
                $set: {
                    status: 'Pendiente de Confirmación' as OrderStatus,
                    receiptUrl: receiptUrl,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        if (!result) {
            return { success: false, message: "Order not found or you are not authorized to update it." };
        }

        const updatedOrder = await getOrderById(orderId);

        if (updatedOrder) {
            await sendReceiptSubmittedNotification(updatedOrder, user);
        }

        revalidatePath('/orders');
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/admin/orders');
        return { success: true, message: "Receipt submitted successfully." };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to submit receipt: ${message}` };
    }
}

export async function getPendingPaymentCount(): Promise<number> {
    return getPendingOrdersService();
}

export async function cancelOrder(orderId: string): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Usuario no autenticado." };
    }

    const db = await getDb();
    const ordersCollection = db.collection('orders');
    const productsCollection = db.collection('products');
    const userId = new ObjectId(session.user.id);

    if (!ObjectId.isValid(orderId)) {
        return { success: false, message: "ID de pedido inválido." };
    }
    const orderObjectId = new ObjectId(orderId);

    const order = await ordersCollection.findOne({ _id: orderObjectId, userId });

    if (!order) {
        return { success: false, message: "Pedido no encontrado o no autorizado." };
    }

    if (order.status !== 'Pendiente de Pago') {
        return { success: false, message: "Solo se pueden cancelar los pedidos pendientes de pago." };
    }

    // Use a transaction to ensure atomicity
    const client = await clientPromise;
    const dbSession = client.startSession();

    try {
        await dbSession.withTransaction(async () => {
            // Restore stock for each item in the order
            for (const item of order.items) {
                await productsCollection.updateOne(
                    { _id: new ObjectId(item.productId) },
                    { $inc: { countInStock: item.quantity } },
                    { session: dbSession }
                );
            }

            // Update order status to "Cancelled"
            const result = await ordersCollection.updateOne(
                { _id: orderObjectId },
                {
                    $set: {
                        status: 'Cancelado' as OrderStatus,
                        updatedAt: new Date()
                    }
                },
                { session: dbSession }
            );

            if (result.matchedCount === 0) {
                throw new Error("No se pudo encontrar el pedido para actualizar.");
            }
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
        return { success: false, message: `Error al cancelar el pedido: ${message}` };
    } finally {
        await dbSession.endSession();
    }

    revalidatePath('/orders');
    return { success: true, message: 'El pedido ha sido cancelado exitosamente.' };
}
