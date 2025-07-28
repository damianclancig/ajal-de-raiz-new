
'use server';

import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import type { Order, User } from './types';
import { ObjectId } from 'mongodb';

export const getDb = async () => {
  const client = await clientPromise;
  return client.db('ajal-de-raiz');
};

const orderFromDoc = (doc: any): Order | null => {
  if (!doc) {
    return null;
  }
  return {
    id: doc._id.toString(),
    userId: doc.userId?.toString() || '',
    user: doc.user,
    items: (doc.items || []).map((item: any) => ({
      ...item,
      productId: item.productId?.toString() || '',
    })),
    totalPrice: doc.totalPrice,
    paymentMethod: doc.paymentMethod,
    status: doc.status,
    receiptUrl: doc.receiptUrl,
    mercadoPagoPreferenceId: doc.mercadoPagoPreferenceId,
    mercadoPagoInitPoint: doc.mercadoPagoInitPoint,
    mercadoPagoPaymentId: doc.mercadoPagoPaymentId,
    mercadoPagoPaymentDetails: doc.mercadoPagoPaymentDetails,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
};

export const getMyOrders = async (): Promise<Order[]> => {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }
  const db = await getDb();
  const ordersCollection = db.collection('orders');
  const orders = await ordersCollection
    .find({ userId: new ObjectId(session.user.id) })
    .sort({ createdAt: -1 })
    .toArray();
  
  return orders.map(orderFromDoc).filter((order): order is Order => order !== null);
};


export const getAllOrders = async (): Promise<Order[]> => {
  const db = await getDb();
  const ordersCollection = db.collection('orders');
  const orders = await ordersCollection.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
    },
    {
        $project: {
            'user.password': 0,
            'user.passwordResetToken': 0,
            'user.passwordResetExpires': 0,
            'user._id': 0,
        }
    }
  ]).toArray();
  
  return orders.map(orderFromDoc).filter((order): order is Order => order !== null);
}


export const getOrderById = async (orderId: string): Promise<Order | null> => {
    if (!ObjectId.isValid(orderId)) {
        return null;
    }
    const db = await getDb();
    const ordersCollection = db.collection('orders');
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });

    return orderFromDoc(order);
}
