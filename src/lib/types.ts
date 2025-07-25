
'use server';

import type { ObjectId } from 'mongodb';

export type ProductState = 'activo' | 'inactivo' | 'vendido';

export interface Product {
  id: string;
  _id?: ObjectId;
  name: string;
  slug: string;
  category: string;
  images: string[];
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
  isFeatured: boolean;
  state: ProductState;
  dataAiHint: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: string;
  updatedAt?: string;
}

export type SlideState = 'habilitado' | 'deshabilitado';

export interface HeroSlide {
    id: string;
    _id?: ObjectId;
    headline: string;
    subtext: string;
    image: string;
    state: SlideState;
    dataAiHint?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CartItem {
  productId: ObjectId;
  quantity: number;
}

export interface Cart {
  _id: ObjectId;
  userId: ObjectId;
  items: CartItem[];
}

export interface PopulatedCartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  countInStock: number;
}

export interface PopulatedCart {
  id: string;
  userId: string;
  items: PopulatedCartItem[];
  totalPrice: number;
}
