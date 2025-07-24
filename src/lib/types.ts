import type { ObjectId } from 'mongodb';

export type ProductState = 'activo' | 'inactivo' | 'vendido';

export interface Product {
  id: string;
  _id?: ObjectId;
  name: string;
  slug: string;
  category: string;
  image: string;
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
