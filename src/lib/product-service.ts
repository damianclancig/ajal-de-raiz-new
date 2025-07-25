import clientPromise from '@/lib/mongodb';
import type { Product } from './types';
import { ObjectId } from 'mongodb';
import { NO_IMAGE_URL } from './utils';

export const getDb = async () => {
  const client = await clientPromise;
  return client.db('ajal-de-raiz');
};

const productFromDoc = (doc: any): Product | null => {
  if (!doc) {
    return null;
  }
  const images = doc.images && doc.images.length > 0 ? doc.images : [NO_IMAGE_URL];

  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    category: doc.category,
    images: images,
    price: doc.price,
    brand: doc.brand,
    rating: doc.rating,
    numReviews: doc.numReviews,
    countInStock: doc.countInStock,
    description: doc.description,
    isFeatured: doc.isFeatured || false,
    state: doc.state || 'inactivo',
    dataAiHint: doc.dataAiHint || 'product image',
    createdAt: doc.createdAt?.toString(),
    updatedAt: doc.updatedAt?.toString(),
  };
};

export const getAllProducts = async (): Promise<Product[]> => {
  const db = await getDb();
  const productsCollection = db.collection('products');
  const products = await productsCollection.find({}).sort({ createdAt: -1 }).toArray();
  return products.map(doc => productFromDoc(doc)).filter(p => p !== null) as Product[];
};

export const getAvailableProducts = async (): Promise<Product[]> => {
  const db = await getDb();
  const productsCollection = db.collection('products');
  const products = await productsCollection.find({ state: 'activo' }).sort({ createdAt: -1 }).toArray();
  return products.map(doc => productFromDoc(doc)).filter(p => p !== null) as Product[];
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const db = await getDb();
  const productsCollection = db.collection('products');
  const products = await productsCollection.find({ isFeatured: true, state: 'activo' }).limit(4).toArray();
  return products.map(doc => productFromDoc(doc)).filter(p => p !== null) as Product[];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const db = await getDb();
  const productsCollection = db.collection('products');
  const product = await productsCollection.findOne({ _id: new ObjectId(id) });
  return productFromDoc(product);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const db = await getDb();
  const productsCollection = db.collection('products');
  const product = await productsCollection.findOne({ slug: slug, state: 'activo' });
  return productFromDoc(product);
};
