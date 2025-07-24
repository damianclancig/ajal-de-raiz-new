
import clientPromise from '@/lib/mongodb';
import type { User } from './types';
import { ObjectId } from 'mongodb';

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
