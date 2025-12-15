'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { getDb, getProductById } from '@/lib/product-service'; // Using shared service
import { auth } from '@/auth';
import type { Cart, PopulatedCart, PopulatedCartItem, ActionResponse } from '@/lib/types';

export async function getPopulatedCart(userId: string): Promise<PopulatedCart | null> {
    const db = await getDb();
    const cartsCollection = db.collection<Cart>('carts');
    const cart = await cartsCollection.findOne({ userId: new ObjectId(userId) });

    if (!cart) {
        return {
            id: '',
            userId,
            items: [],
            totalPrice: 0,
        };
    }

    const populatedItems: PopulatedCartItem[] = await Promise.all(
        cart.items.map(async (item) => {
            const product = await getProductById(item.productId.toString());
            if (product) {
                return {
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    quantity: item.quantity,
                    image: product.images[0],
                    countInStock: product.countInStock
                };
            }
            return null;
        })
    ).then(items => items.filter((item): item is PopulatedCartItem => item !== null));

    const totalPrice = populatedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
        id: cart._id.toString(),
        userId,
        items: populatedItems,
        totalPrice,
    };
}

export async function getCart(): Promise<PopulatedCart | null> {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    return getPopulatedCart(session.user.id);
}

export async function addToCart(productId: string, quantity: number): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const db = await getDb();
        const cartsCollection = db.collection<Cart>('carts');
        const product = await getProductById(productId);

        if (!product || product.countInStock < quantity) {
            return { success: false, message: "Product not available or insufficient stock." };
        }

        const userId = new ObjectId(session.user.id);
        let cart = await cartsCollection.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId: new ObjectId(productId), quantity });
            }
            await cartsCollection.updateOne({ _id: cart._id }, { $set: { items: cart.items } });
        } else {
            const newCart: Omit<Cart, '_id'> = {
                userId,
                items: [{ productId: new ObjectId(productId), quantity }],
            };
            await cartsCollection.insertOne(newCart as any); // cast as any to bypass TS error with _id
        }

        revalidatePath('/cart');
        const populatedCart = await getPopulatedCart(session.user.id);
        return { success: true, message: "Product added to cart", cart: populatedCart };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add to cart: ${message}` };
    }
}

export async function updateCartItemQuantity(productId: string, quantity: number): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "User not authenticated." };
    }
    if (quantity <= 0) {
        return removeFromCart(productId);
    }

    try {
        const db = await getDb();
        const cartsCollection = db.collection<Cart>('carts');
        const product = await getProductById(productId);

        if (!product || product.countInStock < quantity) {
            return { success: false, message: "Insufficient stock." };
        }

        const userId = new ObjectId(session.user.id);
        const result = await cartsCollection.updateOne(
            { userId, 'items.productId': new ObjectId(productId) },
            { $set: { 'items.$.quantity': quantity } }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: "Item not in cart." };
        }

        revalidatePath('/cart');
        const populatedCart = await getPopulatedCart(session.user.id);
        return { success: true, message: "Cart updated.", cart: populatedCart };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update cart: ${message}` };
    }
}

export async function removeFromCart(productId: string): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const db = await getDb();
        const cartsCollection = db.collection<Cart>('carts');
        const userId = new ObjectId(session.user.id);

        await cartsCollection.updateOne(
            { userId },
            { $pull: { items: { productId: new ObjectId(productId) } } }
        );

        revalidatePath('/cart');
        const populatedCart = await getPopulatedCart(session.user.id);
        return { success: true, message: "Item removed from cart.", cart: populatedCart };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to remove item: ${message}` };
    }
}
