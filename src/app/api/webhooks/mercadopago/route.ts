/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



import { NextRequest, NextResponse } from 'next/server';
import { getPaymentWithClient } from '@/lib/mercadopago-service';
import { getDb } from '@/lib/product-service';
import { ObjectId } from 'mongodb';
import type { MercadoPagoPaymentDetails } from '@/lib/types';
import { sendMercadoPagoPaymentSuccessNotification } from '@/lib/email-service';
import { logError } from '@/lib/log-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = body.type;

    if (topic === 'payment') {
      const paymentId = body.data.id;
      
      const { payment } = await getPaymentWithClient(paymentId);

      if (payment && payment.status === 'approved') {
        const orderId = payment.external_reference;
        
        if (!orderId || !ObjectId.isValid(orderId)) {
          const errorMessage = `Invalid or missing external_reference (order ID) in webhook: ${orderId}`;
          await logError({
            path: '/api/webhooks/mercadopago',
            functionName: 'POST',
            errorMessage: errorMessage,
            metadata: { webhookBody: body, paymentDetails: payment }
          });
          return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
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
            await sendMercadoPagoPaymentSuccessNotification(orderId, paymentId.toString());
        } else {
            const warnMessage = `Webhook received for order ${orderId}, but no matching order was found to update.`;
            console.warn(warnMessage);
            await logError({
              path: '/api/webhooks/mercadopago',
              functionName: 'POST',
              errorMessage: warnMessage,
              metadata: { webhookBody: body, paymentDetails: payment }
            });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await logError({
        path: '/api/webhooks/mercadopago',
        functionName: 'POST',
        errorMessage: message,
        stackTrace: error instanceof Error ? error.stack : undefined,
        metadata: { body: await req.text().catch(() => 'Could not parse body') }
    });
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
