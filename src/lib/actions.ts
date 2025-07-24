'use server';

import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';
import { Product, ProductState, User, HeroSlide, SlideState } from './types';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { hash } from 'bcryptjs';
import { getDb } from './product-service';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendContactRequestEmail } from './email-service';

const productFromDoc = (doc: any): Product => {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    category: doc.category,
    images: doc.images || [],
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

type ActionResponse = {
  success: boolean;
  message: string;
  product?: Product | null;
  user?: User | null;
  slide?: HeroSlide | null;
};

// Helper function to create a URL-friendly slug
const createSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const getImagesFromFormData = (formData: FormData): string[] => {
    const images: string[] = [];
    formData.forEach((value, key) => {
        if (key.startsWith('images[')) {
            images.push(value as string);
        }
    });
    return images;
};

export async function createProduct(formData: FormData): Promise<ActionResponse> {
  try {
    const db = await getDb();
    const productsCollection = db.collection('products');
    
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const images = getImagesFromFormData(formData);
    
    if (!name || isNaN(price)) {
      return { success: false, message: "Name and Price are required." };
    }

    const newProductData = {
      name: name,
      slug: createSlug(name),
      description: formData.get('description') as string || '',
      category: formData.get('category') as string || 'Uncategorized',
      price: price,
      images: images,
      brand: formData.get('brand') as string || 'Ajal',
      isFeatured: formData.get('isFeatured') === 'on',
      state: 'activo' as ProductState,
      rating: 0,
      numReviews: 0,
      countInStock: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    const state = formData.get('state') as ProductState;
    const images = getImagesFromFormData(formData);


    if (!name || isNaN(price)) {
        return { success: false, message: "Name and Price are required." };
    }
    if (!['activo', 'inactivo', 'vendido'].includes(state)) {
      return { success: false, message: 'Invalid state value.' };
    }

    const updateData = {
      name: name,
      slug: createSlug(name),
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      price: price,
      images: images,
      brand: formData.get('brand') as string,
      isFeatured: formData.get('isFeatured') === 'on',
      state: state,
      updatedAt: new Date(),
    };

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: updateData }
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
      { $set: { state: 'inactivo' as ProductState, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: 'Product not found.' };
    }
    
    const updatedProduct = await productsCollection.findOne({_id: new ObjectId(productId)});

    revalidatePath('/admin');
    revalidatePath('/products');
    revalidatePath('/');
    
    return { success: true, message: 'Product set to inactive.', product: productFromDoc(updatedProduct) };
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


export async function registerUser(formData: FormData): Promise<ActionResponse> {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
      return { success: false, message: 'Name, email, and password are required.' };
    }
    
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return { success: false, message: 'User with this email already exists.' };
    }

    const hashedPassword = await hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(newUser);
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to register user: ${message}` };
  }

  redirect('/login');
}


export async function updateUser(userId: string, formData: FormData): Promise<ActionResponse> {
  try {
    if (!ObjectId.isValid(userId)) {
      return { success: false, message: 'Invalid user ID.' };
    }
    const db = await getDb();
    const usersCollection = db.collection('users');

    const name = formData.get('name') as string;
    if (!name) {
      return { success: false, message: 'Name is required.' };
    }

    const updateData = {
      name: name,
      isAdmin: formData.get('isAdmin') === 'on',
      updatedAt: new Date(),
    };

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: 'User not found.' };
    }
    
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update user: ${message}` };
  }

  revalidatePath('/admin/users');
  revalidatePath(`/admin/users/${userId}/edit`);
  redirect('/admin/users');
}


// SLIDE ACTIONS

export async function createSlide(formData: FormData): Promise<ActionResponse> {
  try {
    const db = await getDb();
    const slidesCollection = db.collection('heroSlides');

    const headline = formData.get('headline') as string;
    const subtext = formData.get('subtext') as string;
    const image = formData.get('image') as string;
    const state = formData.get('state') as SlideState;

    if (!headline || !image) {
      return { success: false, message: 'Headline and Image are required.' };
    }
     if (!['habilitado', 'deshabilitado'].includes(state)) {
      return { success: false, message: 'Invalid state value.' };
    }

    const newSlideData = {
      headline,
      subtext,
      image,
      state,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await slidesCollection.insertOne(newSlideData);
    if (!result.insertedId) {
      throw new Error('Failed to create slide.');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to create slide: ${message}` };
  }

  revalidatePath('/admin/slides');
  revalidatePath('/');
  redirect('/admin/slides');
}

export async function updateSlide(slideId: string, formData: FormData): Promise<ActionResponse> {
  try {
    if (!ObjectId.isValid(slideId)) {
      return { success: false, message: 'Invalid slide ID.' };
    }
    const db = await getDb();
    const slidesCollection = db.collection('heroSlides');

    const headline = formData.get('headline') as string;
    const subtext = formData.get('subtext') as string;
    const image = formData.get('image') as string;
    const state = formData.get('state') as SlideState;

    if (!headline || !image) {
      return { success: false, message: 'Headline and Image are required.' };
    }
    if (!['habilitado', 'deshabilitado'].includes(state)) {
      return { success: false, message: 'Invalid state value.' };
    }

    const updateData = {
      headline,
      subtext,
      image,
      state,
      updatedAt: new Date(),
    };

    const result = await slidesCollection.updateOne(
      { _id: new ObjectId(slideId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: 'Slide not found.' };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update slide: ${message}` };
  }

  revalidatePath('/admin/slides');
  revalidatePath(`/admin/slides/${slideId}/edit`);
  revalidatePath('/');
  redirect('/admin/slides');
}

export async function deleteSlide(slideId: string): Promise<ActionResponse> {
  try {
    if (!ObjectId.isValid(slideId)) {
      return { success: false, message: 'Invalid slide ID.' };
    }
    const db = await getDb();
    const slidesCollection = db.collection('heroSlides');

    const result = await slidesCollection.deleteOne({ _id: new ObjectId(slideId) });

    if (result.deletedCount === 0) {
      return { success: false, message: 'Slide not found.' };
    }

    revalidatePath('/admin/slides');
    revalidatePath('/');
    
    return { success: true, message: 'Slide deleted successfully.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete slide: ${message}` };
  }
}

export async function requestPasswordReset(formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email') as string;
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not
      return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiry for 1 hour
    const passwordResetExpires = new Date(Date.now() + 3600000); 

    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { passwordResetToken, passwordResetExpires } }
    );
    
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    await sendPasswordResetEmail(user.email, user.name, resetUrl);
    
    return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };

  } catch (error) {
    const message = error instanceof Error ? `Failed to send email: ${error.message}` : 'An unknown error occurred while sending email.';
    console.error(message);
    return { success: false, message };
  }
}

export async function resetPassword(formData: FormData): Promise<ActionResponse> {
    const password = formData.get('password') as string;
    const token = formData.get('token') as string;

    if (!password || !token) {
      return { success: false, message: 'Password and token are required.' };
    }

    try {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const db = await getDb();
      const usersCollection = db.collection('users');

      const user = await usersCollection.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
      });

      if (!user) {
        return { success: false, message: 'Invalid or expired password reset token.' };
      }

      const hashedPassword = await hash(password, 10);

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: { password: hashedPassword },
          $unset: { passwordResetToken: "", passwordResetExpires: "" },
        }
      );
      
      return { success: true, message: 'Password has been reset successfully.' };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      return { success: false, message };
    }
}

export async function handleContactForm(formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email') as string;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { success: false, message: 'Por favor, ingresa un correo electrónico válido.' };
  }
  
  try {
    await sendContactRequestEmail(email);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to send contact email: ${message}` };
  }
}
