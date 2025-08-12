
'use server';

import { getDb } from './product-service';
import type { Service } from './types';
import { ObjectId } from 'mongodb';

const serviceFromDoc = (doc: any): Service | null => {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    icon: doc.icon,
    title: doc.title,
    description: doc.description,
    details: doc.details || [],
    price: doc.price,
    note: doc.note,
    createdAt: doc.createdAt?.toString(),
    updatedAt: doc.updatedAt?.toString(),
  };
};

export const getAllServices = async (): Promise<Service[]> => {
  const db = await getDb();
  const servicesCollection = db.collection('services');
  const services = await servicesCollection.find({}).sort({ createdAt: -1 }).toArray();
  return services.map(doc => serviceFromDoc(doc)).filter(s => s !== null) as Service[];
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const db = await getDb();
  const servicesCollection = db.collection('services');
  const service = await servicesCollection.findOne({ _id: new ObjectId(id) });
  return serviceFromDoc(service);
};
