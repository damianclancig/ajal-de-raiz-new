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


import clientPromise from '@/lib/mongodb';
import type { User } from './types';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';

const getDb = async () => {
  const client = await clientPromise;
  return client.db('ajal-de-raiz');
};

const userFromDoc = (doc: any): User | null => {
  if (!doc) {
    return null;
  }
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    isAdmin: doc.isAdmin || false,
    phone: doc.phone || '',
    profileImage: doc.profileImage || '',
    address: doc.address || {},
    createdAt: doc.createdAt?.toString(),
    updatedAt: doc.updatedAt?.toString(),
  };
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).sort({ name: 1 }).toArray();
    return users.map(doc => userFromDoc(doc)).filter(u => u !== null) as User[];
  } catch (error) {
    console.error('Failed to get all users:', error);
    return [];
  }
};


export const getUserById = async (id: string): Promise<User | null> => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    return userFromDoc(user);
  } catch (error) {
    console.error(`Failed to get user by id ${id}:`, error);
    return null;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return getUserById(session.user.id);
};
