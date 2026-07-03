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
