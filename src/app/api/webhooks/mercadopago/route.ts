
import { NextRequest, NextResponse } from 'next/server';
import { getPaymentWithClient } from '@/lib/mercadopago-service';
import { getDb } from '@/lib/product-service';
import { ObjectId } from 'mongodb';
import type { MercadoPagoPaymentDetails } from '@/lib/types';
import { sendMercadoPagoPaymentSuccessNotification } from '@/lib/email-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = body.type;

    if (topic === 'payment') {
      const paymentId = body.data.id;
      
      // La validación de la firma es crucial en producción para la seguridad.
      // En desarrollo, puede ser más fácil probar sin ella si se presentan problemas
      // con ngrok o proxies inversos.
      // DESCOMENTAR LA VALIDACIÓN ANTES DE PASAR A PRODUCCIÓN.
      /*
      const signature = req.headers.get('x-signature');
      const requestId = req.headers.get('x-request-id');

      if (!process.env.MERCADOPAGO_WEBHOOK_SECRET) {
        throw new Error('MercadoPago webhook secret is not configured.');
      }
      
      const { client } = await getPaymentWithClient(paymentId);
      
      const isValidSignature = await client.utils.validateWebhookSignature({
          signature,
          requestId,
          secret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
          body: JSON.stringify(body)
      });
      
      if (!isValidSignature) {
         console.warn('Invalid webhook signature received.');
         return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 403 });
      }
      */
      
      const { payment } = await getPaymentWithClient(paymentId);

      if (payment && payment.status === 'approved') {
        const orderId = payment.external_reference;
        
        if (!orderId || !ObjectId.isValid(orderId)) {
          console.error(`Invalid order ID in webhook: ${orderId}`);
          return NextResponse.json({ success: false, message: 'Invalid order ID in webhook' }, { status: 400 });
        }
        
        const db = await getDb();
        const ordersCollection = db.collection('orders');

        const paymentDetails: MercadoPagoPaymentDetails = {
          paymentMethodId: payment.payment_method_id || 'unknown',
          paymentTypeId: payment.payment_type_id || 'unknown',
          lastFourDigits: payment.card?.last_four_digits,
          installments: payment.installments,
        };

        const updateResult = await ordersCollection.updateOne(
          { _id: new ObjectId(orderId) },
          { $set: { 
              status: 'Confirmado', 
              mercadoPagoPaymentId: paymentId.toString(),
              mercadoPagoPaymentDetails: paymentDetails,
              updatedAt: new Date() 
            } 
          }
        );

        if (updateResult.matchedCount > 0) {
            console.log(`Order ${orderId} confirmed via webhook.`);
            // Send admin notification
            await sendMercadoPagoPaymentSuccessNotification(orderId, paymentId.toString());
        } else {
            console.warn(`Webhook received for order ${orderId}, but no matching order was found to update.`);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('MercadoPago webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
