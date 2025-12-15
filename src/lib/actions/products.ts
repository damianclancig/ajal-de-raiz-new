'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { getDb, getPaginatedProducts as getPaginatedProductsService } from '@/lib/product-service';
import type { ActionResponse, Product, ProductState } from '@/lib/types';
import { createSlug, getImagesFromFormData } from '@/lib/utils-server'; // Imported from shared utils

export async function createProduct(formData: FormData): Promise<ActionResponse> {
    try {
        const db = await getDb();
        const productsCollection = db.collection('products');

        const name = formData.get('name') as string;
        const price = parseFloat(formData.get('price') as string);
        const oldPrice = parseFloat(formData.get('oldPrice') as string);
        const countInStock = parseInt(formData.get('countInStock') as string, 10);
        const images = getImagesFromFormData(formData);

        if (!name || isNaN(price)) {
            return { success: false, message: "Name and Price are required." };
        }

        let slug = createSlug(name);
        const slugExists = await productsCollection.findOne({ slug });
        if (slugExists) {
            const randomSuffix = crypto.randomBytes(3).toString('hex');
            slug = `${slug}-${randomSuffix}`;
        }

        const newProductData: Omit<Product, 'id'> = {
            name: name,
            slug: slug,
            description: formData.get('description') as string || '',
            care: formData.get('care') as string || '',
            category: formData.get('category') as string || 'Uncategorized',
            price: price,
            oldPrice: !isNaN(oldPrice) && oldPrice > 0 ? oldPrice : undefined,
            images: images,
            brand: formData.get('brand') as string || 'Ajal',
            isFeatured: formData.get('isFeatured') === 'on',
            state: 'activo' as ProductState,
            rating: 0,
            numReviews: 0,
            countInStock: isNaN(countInStock) ? 0 : countInStock,
            dataAiHint: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const result = await productsCollection.insertOne(newProductData);

        if (!result.insertedId) {
            throw new Error('Failed to create product.');
        }

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to create product: ${message}` };
    }

    revalidatePath('/admin');
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function updateProduct(productId: string, formData: FormData): Promise<ActionResponse> {
    try {
        if (!ObjectId.isValid(productId)) {
            return { success: false, message: 'Invalid product ID.' };
        }
        const db = await getDb();
        const productsCollection = db.collection('products');

        const name = formData.get('name') as string;
        const price = parseFloat(formData.get('price') as string);
        const oldPrice = parseFloat(formData.get('oldPrice') as string);
        const countInStock = parseInt(formData.get('countInStock') as string, 10);
        const state = formData.get('state') as ProductState;
        const images = getImagesFromFormData(formData);


        if (!name || isNaN(price)) {
            return { success: false, message: "Name and Price are required." };
        }
        if (!['activo', 'inactivo', 'vendido'].includes(state)) {
            return { success: false, message: 'Invalid state value.' };
        }

        const updateFields: { [key: string]: any } = {
            name: name,
            description: formData.get('description') as string,
            care: formData.get('care') as string || '',
            category: formData.get('category') as string,
            price: price,
            images: images,
            brand: formData.get('brand') as string,
            isFeatured: formData.get('isFeatured') === 'on',
            state: state,
            countInStock: isNaN(countInStock) ? 0 : countInStock,
            updatedAt: new Date().toISOString(),
        };

        const updateOperation: { $set: Partial<Omit<Product, 'id'>>; $unset?: { oldPrice?: number } } = {
            $set: updateFields,
        };

        if (!isNaN(oldPrice) && oldPrice > 0) {
            updateFields.oldPrice = oldPrice;
        } else {
            updateOperation.$unset = { oldPrice: 1 };
        }

        const result = await productsCollection.updateOne(
            { _id: new ObjectId(productId) },
            updateOperation
        );

        if (result.matchedCount === 0) {
            return { success: false, message: 'Product not found.' };
        }

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update product: ${message}` };
    }

    revalidatePath('/admin');
    revalidatePath(`/admin/products/${productId}/edit`);
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function deleteProduct(productId: string): Promise<ActionResponse> {
    try {
        if (!ObjectId.isValid(productId)) {
            return { success: false, message: 'Invalid product ID.' };
        }
        const db = await getDb();
        const productsCollection = db.collection('products');

        const result = await productsCollection.updateOne(
            { _id: new ObjectId(productId) },
            { $set: { state: 'inactivo' as ProductState, updatedAt: new Date().toISOString() } }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: 'Product not found.' };
        }

        const updatedProductDoc = await productsCollection.findOne({ _id: new ObjectId(productId) });
        const productFromDoc = (doc: any): Product => ({
            id: doc._id.toString(), name: doc.name, slug: doc.slug, category: doc.category, images: doc.images || [], price: doc.price, brand: doc.brand, rating: doc.rating, numReviews: doc.numReviews, countInStock: doc.countInStock, description: doc.description, care: doc.care, isFeatured: doc.isFeatured || false, state: doc.state || 'inactivo', dataAiHint: doc.dataAiHint || 'product image', createdAt: doc.createdAt?.toString(), updatedAt: doc.updatedAt?.toString(), oldPrice: doc.oldPrice,
        });
        const updatedProduct = productFromDoc(updatedProductDoc);


        revalidatePath('/admin');
        revalidatePath('/products');
        revalidatePath('/');

        return { success: true, message: 'Product set to inactive.', product: updatedProduct };
    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete product: ${message}` };
    }
}

export async function physicallyDeleteProduct(productId: string): Promise<ActionResponse> {
    try {
        if (!ObjectId.isValid(productId)) {
            return { success: false, message: 'Invalid product ID.' };
        }
        const db = await getDb();
        const productsCollection = db.collection('products');

        const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });

        if (result.deletedCount === 0) {
            return { success: false, message: 'Product not found or already deleted.' };
        }

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to physically delete product: ${message}` };
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function getPaginatedProducts(params: {
    offset: number;
    limit: number;
    searchTerm?: string;
    category?: string;
    sortOrder?: string;
    state?: ProductState;
}): Promise<ActionResponse> {
    try {
        const products = await getPaginatedProductsService(params);
        return { success: true, message: 'Products fetched', products };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to fetch products: ${message}` };
    }
}
