
'use server';

import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import type { OrderItem, User } from './types';

const getClient = () => new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

interface PreferenceRequest {
    id: string;
    items: OrderItem[];
    user: User;
}

export async function createPreference(request: PreferenceRequest) {
  const client = getClient();
  const preference = new Preference(client);

  try {
    const preferenceData = await preference.create({
      body: {
        items: request.items.map(item => ({
            id: item.productId,
            title: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'ARS',
            picture_url: item.image,
            description: item.name,
        })),
        payer: {
            name: request.user.name || undefined,
            email: request.user.email || undefined,
        },
        back_urls: {
            success: `${process.env.NEXTAUTH_URL}/orders?status=success`,
            failure: `${process.env.NEXTAUTH_URL}/orders?status=failure`,
            pending: `${process.env.NEXTAUTH_URL}/orders?status=pending`,
        },
        auto_return: 'approved',
        external_reference: request.id,
        notification_url: `${process.env.NEXTAUTH_URL}/api/webhooks/mercadopago`,
      },
    });
    
    return preferenceData;
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    throw new Error('Failed to create MercadoPago preference.');
  }
}

export async function getPayment(paymentId: string) {
    const client = getClient();
    const payment = new Payment(client);
    try {
        const paymentDetails = await payment.get({ id: paymentId });
        return paymentDetails;
    } catch (error) {
        console.error('Error getting payment from MercadoPago:', error);
        throw error;
    }
}

export async function getPaymentWithClient(paymentId: string) {
    const client = getClient();
    const payment = new Payment(client);
    try {
        const paymentDetails = await payment.get({ id: paymentId });
        return { client, payment: paymentDetails };
    } catch (error) {
        console.error('Error getting payment from MercadoPago:', error);
        throw error;
    }
}
