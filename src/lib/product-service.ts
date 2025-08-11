
import clientPromise from '@/lib/mongodb';
import type { Product, ProductState } from './types';
import { ObjectId, Filter } from 'mongodb';
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
    oldPrice: doc.oldPrice,
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

export const getPaginatedProducts = async (params: {
    offset?: number;
    limit?: number;
    searchTerm?: string;
    category?: string;
    sortOrder?: string;
    state?: ProductState;
}): Promise<Product[]> => {
    const { 
        offset = 0, 
        limit = 12, 
        searchTerm, 
        category, 
        sortOrder = 'name_asc', 
        state 
    } = params;
    
    const db = await getDb();
    const productsCollection = db.collection('products');

    const query: Filter<Product> = {};

    if (state) {
        query.state = state;
    }

    if (searchTerm) {
        query.name = { $regex: searchTerm, $options: 'i' };
    }
    if (category && category !== 'All') {
        query.category = category;
    }

    let sort: any = {};
    switch (sortOrder) {
        case 'price_asc':
            sort = { price: 1 };
            break;
        case 'price_desc':
            sort = { price: -1 };
            break;
        case 'name_asc':
            sort = { name: 1 };
            break;
        case 'name_desc':
            sort = { name: -1 };
            break;
        default:
            sort = { name: 1 };
    }

    const products = await productsCollection
        .find(query)
        .sort(sort)
        .skip(offset)
        .limit(limit)
        .toArray();
    
    return products.map(doc => productFromDoc(doc)).filter(p => p !== null) as Product[];
};

export const getUniqueCategories = async (): Promise<string[]> => {
    const db = await getDb();
    const productsCollection = db.collection('products');
    const categories = await productsCollection.distinct('category', { state: 'activo' });
    return ['All', ...categories];
}

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
