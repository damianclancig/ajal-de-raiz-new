

'use server';

import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';
import { Product, ProductState, User, HeroSlide, SlideState, Cart, CartItem, PopulatedCart, PopulatedCartItem, Order, OrderItem, OrderStatus, PaymentMethod, Address, Service } from './types';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { hash } from 'bcryptjs';
import { getDb, getProductById, getPaginatedProducts as getPaginatedProductsService } from './product-service';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendContactRequestEmail, sendNewOrderNotification, sendReceiptSubmittedNotification } from './email-service';
import { auth, signIn } from '@/auth';
import { getOrderById, getPendingPaymentOrdersCount } from './order-service';
import { createPreference } from './mercadopago-service';
import { getCurrentUser } from './user-service';

type ActionResponse = {
  success: boolean;
  message: string;
  product?: Product | null;
  products?: Product[] | null;
  user?: User | null;
  slide?: HeroSlide | null;
  cart?: PopulatedCart | null;
  order?: Order | null;
  init_point?: string;
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
    
    const updatedProductDoc = await productsCollection.findOne({_id: new ObjectId(productId)});
    const productFromDoc = (doc: any): Product => ({
        id: doc._id.toString(), name: doc.name, slug: doc.slug, category: doc.category, images: doc.images || [], price: doc.price, brand: doc.brand, rating: doc.rating, numReviews: doc.numReviews, countInStock: doc.countInStock, description: doc.description, isFeatured: doc.isFeatured || false, state: doc.state || 'inactivo', dataAiHint: doc.dataAiHint || 'product image', createdAt: doc.createdAt?.toString(), updatedAt: doc.updatedAt?.toString(), oldPrice: doc.oldPrice,
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
    
    return { success: true, message: 'User created successfully.' };
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to register user: ${message}` };
  }
}

export async function updateUserProfile(formData: FormData): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const db = await getDb();
        const usersCollection = db.collection('users');
        const userId = new ObjectId(session.user.id);
        
        const address: Address = {
            street: formData.get('street') as string,
            number: formData.get('number') as string,
            city: formData.get('city') as string,
            province: formData.get('province') as string,
            country: "Argentina",
            zipCode: formData.get('zipCode') as string,
            instructions: formData.get('instructions') as string,
        };

        const updateData: Partial<User> & { $unset?: { profileImage?: string } } = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            address: address,
            updatedAt: new Date(),
        };
        
        const profileImage = formData.get('profileImage') as string;

        if (profileImage) {
            updateData.profileImage = profileImage;
        } else {
            // If the profileImage field is present but empty, it means we should remove it.
            if (formData.has('profileImage')) {
                 updateData.$unset = { profileImage: "" };
            }
        }

        const result = await usersCollection.updateOne(
            { _id: userId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: 'User not found.' };
        }

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update profile: ${message}` };
    }

    revalidatePath('/profile');
    revalidatePath('/cart');
    return { success: true, message: 'Profile updated successfully.' };
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

    const address: Address = {
        street: formData.get('street') as string,
        number: formData.get('number') as string,
        city: formData.get('city') as string,
        province: formData.get('province') as string,
        country: formData.get('country') as string,
        zipCode: formData.get('zipCode') as string,
        instructions: formData.get('instructions') as string,
    };

    const updateData = {
      name: name,
      isAdmin: formData.get('isAdmin') === 'on',
      phone: formData.get('phone') as string,
      address: address,
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

// SERVICE ACTIONS
export async function createService(formData: FormData): Promise<ActionResponse> {
  try {
    const db = await getDb();
    const servicesCollection = db.collection('services');

    const details = (formData.get('details') as string)
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const newService: Omit<Service, 'id'> = {
      icon: formData.get('icon') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      details,
      price: formData.get('price') as string,
      note: formData.get('note') as string,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!newService.title || !newService.icon) {
      return { success: false, message: 'Title and Icon are required.' };
    }

    await servicesCollection.insertOne(newService);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to create service: ${message}` };
  }
  revalidatePath('/admin/services');
  revalidatePath('/');
  redirect('/admin/services');
}

export async function updateService(serviceId: string, formData: FormData): Promise<ActionResponse> {
  if (!ObjectId.isValid(serviceId)) {
    return { success: false, message: 'Invalid service ID.' };
  }
  try {
    const db = await getDb();
    const servicesCollection = db.collection('services');
    
    const details = (formData.get('details') as string)
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
      
    const updateData: Partial<Service> = {
      icon: formData.get('icon') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      details,
      price: formData.get('price') as string,
      note: formData.get('note') as string,
      updatedAt: new Date().toISOString(),
    };

    if (!updateData.title || !updateData.icon) {
      return { success: false, message: 'Title and Icon are required.' };
    }

    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(serviceId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: 'Service not found.' };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update service: ${message}` };
  }
  revalidatePath('/admin/services');
  revalidatePath('/');
  redirect('/admin/services');
}

export async function deleteService(serviceId: string): Promise<ActionResponse> {
  if (!ObjectId.isValid(serviceId)) {
    return { success: false, message: 'Invalid service ID.' };
  }
  try {
    const db = await getDb();
    const servicesCollection = db.collection('services');
    const result = await servicesCollection.deleteOne({ _id: new ObjectId(serviceId) });

    if (result.deletedCount === 0) {
      return { success: false, message: 'Service not found.' };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete service: ${message}` };
  }
  revalidatePath('/admin/services');
  revalidatePath('/');
  return { success: true, message: 'Service deleted successfully.' };
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
  const message = formData.get('message') as string;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { success: false, message: 'Por favor, ingresa un correo electrónico válido.' };
  }
   if (!message) {
    return { success: false, message: 'Por favor, escribe un mensaje.' };
  }
  
  try {
    await sendContactRequestEmail(email, message);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to send contact email: ${errorMessage}` };
  }
}


// CART ACTIONS

async function getPopulatedCart(userId: string): Promise<PopulatedCart | null> {
    const db = await getDb();
    const cartsCollection = db.collection<Cart>('carts');
    const cart = await cartsCollection.findOne({ userId: new ObjectId(userId) });

    if (!cart) {
        return {
            id: '',
            userId,
            items: [],
            totalPrice: 0,
        };
    }

    const populatedItems: PopulatedCartItem[] = await Promise.all(
        cart.items.map(async (item) => {
            const product = await getProductById(item.productId.toString());
            if (product) {
                return {
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    quantity: item.quantity,
                    image: product.images[0],
                    countInStock: product.countInStock
                };
            }
            return null;
        })
    ).then(items => items.filter((item): item is PopulatedCartItem => item !== null));

    const totalPrice = populatedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
        id: cart._id.toString(),
        userId,
        items: populatedItems,
        totalPrice,
    };
}


export async function getCart(): Promise<PopulatedCart | null> {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    return getPopulatedCart(session.user.id);
}


export async function addToCart(productId: string, quantity: number): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const db = await getDb();
        const cartsCollection = db.collection<Cart>('carts');
        const product = await getProductById(productId);

        if (!product || product.countInStock < quantity) {
            return { success: false, message: "Product not available or insufficient stock." };
        }

        const userId = new ObjectId(session.user.id);
        let cart = await cartsCollection.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId: new ObjectId(productId), quantity });
            }
            await cartsCollection.updateOne({ _id: cart._id }, { $set: { items: cart.items } });
        } else {
            const newCart: Omit<Cart, '_id'> = {
                userId,
                items: [{ productId: new ObjectId(productId), quantity }],
            };
            await cartsCollection.insertOne(newCart);
        }

        revalidatePath('/cart');
        const populatedCart = await getPopulatedCart(session.user.id);
        return { success: true, message: "Product added to cart", cart: populatedCart };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add to cart: ${message}` };
    }
}

export async function updateCartItemQuantity(productId: string, quantity: number): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "User not authenticated." };
    }
    if (quantity <= 0) {
        return removeFromCart(productId);
    }
    
    try {
        const db = await getDb();
        const cartsCollection = db.collection<Cart>('carts');
        const product = await getProductById(productId);

        if (!product || product.countInStock < quantity) {
            return { success: false, message: "Insufficient stock." };
        }
        
        const userId = new ObjectId(session.user.id);
        const result = await cartsCollection.updateOne(
            { userId, 'items.productId': new ObjectId(productId) },
            { $set: { 'items.$.quantity': quantity } }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: "Item not in cart." };
        }
        
        revalidatePath('/cart');
        const populatedCart = await getPopulatedCart(session.user.id);
        return { success: true, message: "Cart updated.", cart: populatedCart };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update cart: ${message}` };
    }
}


export async function removeFromCart(productId: string): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const db = await getDb();
        const cartsCollection = db.collection<Cart>('carts');
        const userId = new ObjectId(session.user.id);

        await cartsCollection.updateOne(
            { userId },
            { $pull: { items: { productId: new ObjectId(productId) } } }
        );
        
        revalidatePath('/cart');
        const populatedCart = await getPopulatedCart(session.user.id);
        return { success: true, message: "Item removed from cart.", cart: populatedCart };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to remove item: ${message}` };
    }
}


// ORDER ACTIONS

export async function createOrder(paymentMethod: PaymentMethod): Promise<ActionResponse> {
    const session = await auth();
    const user = await getCurrentUser();
    if (!session?.user?.id || !user) {
        return { success: false, message: "User not authenticated." };
    }

    const db = await getDb();
    const cartsCollection = db.collection<Cart>('carts');
    const productsCollection = db.collection('products');
    const ordersCollection = db.collection('orders');
    
    const userId = new ObjectId(session.user.id);
    const cart = await getPopulatedCart(session.user.id);
    
    if (!cart || cart.items.length === 0) {
        return { success: false, message: "El carrito está vacío." };
    }
    
    const orderItems: OrderItem[] = cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
    }));

    let initialStatus: OrderStatus = 'Pendiente';
    if (paymentMethod === 'Transferencia Bancaria' || paymentMethod === 'MercadoPago') {
        initialStatus = 'Pendiente de Pago';
    }

    // For MercadoPago, we create the preference first.
    if (paymentMethod === 'MercadoPago') {
        try {
            // Step 1: Create the order in DB to get an ID
            const orderToInsert = {
                userId: userId,
                items: orderItems,
                totalPrice: cart.totalPrice,
                paymentMethod: paymentMethod,
                status: initialStatus,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const orderResult = await ordersCollection.insertOne(orderToInsert);
            const orderId = orderResult.insertedId;

            // Step 2: Create MP preference with the real order ID
            const preference = await createPreference({
                id: orderId.toString(),
                items: orderItems,
                user: user,
            });

            // Step 3: Update the order with the preference details
            await ordersCollection.updateOne(
                { _id: orderId },
                { $set: { 
                    mercadoPagoPreferenceId: preference.id,
                    mercadoPagoInitPoint: preference.init_point 
                }}
            );
            
            // Step 4: Decrease stock
            for (const item of cart.items) {
                await productsCollection.updateOne(
                    { _id: new ObjectId(item.productId) },
                    { $inc: { countInStock: -item.quantity } }
                );
            }

            // Step 5: Clear cart
            await cartsCollection.deleteOne({ userId });

            // Step 6: Send notifications
            const newOrder = await getOrderById(orderId.toString());
            if (newOrder) {
                await sendNewOrderNotification(newOrder, user);
            }

            revalidatePath('/cart');
            revalidatePath('/orders');
            
            return { success: true, message: "Order created, redirecting to payment.", init_point: preference.init_point };

        } catch (error) {
            console.error("Failed to create MercadoPago preference or order:", error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred with MercadoPago.';
            // We don't create the order if the preference fails. The flow stops here.
            return { success: false, message: `No se pudo generar el enlace de pago: ${message}` };
        }
    }

    // --- Flow for other payment methods (Cash, Bank Transfer) ---
    try {
        const orderToInsert = {
            userId: userId,
            items: orderItems,
            totalPrice: cart.totalPrice,
            paymentMethod: paymentMethod,
            status: initialStatus,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await ordersCollection.insertOne(orderToInsert);
        const orderId = result.insertedId;

        for (const item of cart.items) {
            await productsCollection.updateOne(
                { _id: new ObjectId(item.productId) },
                { $inc: { countInStock: -item.quantity } }
            );
        }

        await cartsCollection.deleteOne({ userId });

        const newOrder = await getOrderById(orderId.toString());
        if (newOrder) {
            await sendNewOrderNotification(newOrder, user);
        }

        revalidatePath('/cart');
        revalidatePath('/orders');

        return { success: true, message: "Order created successfully." };

    } catch (error) {
        console.error("Critical error during order creation:", error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to create order: ${message}` };
    }
}


export async function updateOrderStatus(orderId: string, formData: FormData): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        return { success: false, message: "User not authorized." };
    }
    
    const status = formData.get('status') as OrderStatus;
    if (!['Pendiente', 'Pendiente de Pago', 'Pendiente de Confirmación', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'].includes(status)) {
        return { success: false, message: "Invalid status." };
    }

    try {
        const db = await getDb();
        const ordersCollection = db.collection('orders');

        const result = await ordersCollection.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status: status, updatedAt: new Date() } }
        );
        
        if (result.matchedCount === 0) {
            return { success: false, message: "Order not found." };
        }
        
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update order status: ${message}` };
    }

    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${orderId}`);
    redirect(`/admin/orders`);
}

export async function submitReceipt(orderId: string, receiptUrl: string): Promise<ActionResponse> {
    const session = await auth();
    const user = await getCurrentUser();
    if (!session?.user?.id || !user) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const db = await getDb();
        const ordersCollection = db.collection('orders');

        const result = await ordersCollection.findOneAndUpdate(
            { _id: new ObjectId(orderId), userId: new ObjectId(session.user.id) },
            { $set: { 
                status: 'Pendiente de Confirmación' as OrderStatus, 
                receiptUrl: receiptUrl,
                updatedAt: new Date() 
            }},
            { returnDocument: 'after' }
        );
        
        if (!result) {
            return { success: false, message: "Order not found or you are not authorized to update it." };
        }
        
        const updatedOrder = await getOrderById(orderId);
        
        if (updatedOrder) {
            await sendReceiptSubmittedNotification(updatedOrder, user);
        }

        revalidatePath('/orders');
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/admin/orders');
        return { success: true, message: "Receipt submitted successfully." };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to submit receipt: ${message}` };
    }
}

export async function getPendingPaymentCount(): Promise<number> {
    return getPendingPaymentOrdersCount();
}

export async function cancelOrder(orderId: string): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Usuario no autenticado." };
    }

    const db = await getDb();
    const ordersCollection = db.collection('orders');
    const productsCollection = db.collection('products');
    const userId = new ObjectId(session.user.id);

    if (!ObjectId.isValid(orderId)) {
        return { success: false, message: "ID de pedido inválido." };
    }
    const orderObjectId = new ObjectId(orderId);

    const order = await ordersCollection.findOne({ _id: orderObjectId, userId });

    if (!order) {
        return { success: false, message: "Pedido no encontrado o no autorizado." };
    }

    if (order.status !== 'Pendiente de Pago') {
        return { success: false, message: "Solo se pueden cancelar los pedidos pendientes de pago." };
    }

    // Use a transaction to ensure atomicity
    const client = await clientPromise;
    const dbSession = client.startSession();

    try {
        await dbSession.withTransaction(async () => {
            // Restore stock for each item in the order
            for (const item of order.items) {
                await productsCollection.updateOne(
                    { _id: new ObjectId(item.productId) },
                    { $inc: { countInStock: item.quantity } },
                    { session: dbSession }
                );
            }

            // Update order status to "Cancelled"
            const result = await ordersCollection.updateOne(
                { _id: orderObjectId },
                { 
                    $set: { 
                        status: 'Cancelado' as OrderStatus, 
                        updatedAt: new Date() 
                    } 
                },
                { session: dbSession }
            );

            if (result.matchedCount === 0) {
                throw new Error("No se pudo encontrar el pedido para actualizar.");
            }
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
        return { success: false, message: `Error al cancelar el pedido: ${message}` };
    } finally {
        await dbSession.endSession();
    }
    
    revalidatePath('/orders');
    return { success: true, message: 'El pedido ha sido cancelado exitosamente.' };
}

    
