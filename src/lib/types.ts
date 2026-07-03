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

import type { ObjectId } from 'mongodb';

export type Language = 'en' | 'es' | 'pt';

export type ProductState = 'activo' | 'inactivo' | 'vendido';

export interface Product {
  id: string;
  _id?: ObjectId;
  name: string;
  slug: string;
  category: string;
  images: string[];
  price: number;
  oldPrice?: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
  care?: string;
  isFeatured: boolean;
  state: ProductState;
  dataAiHint: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  street?: string;
  number?: string;
  city?: string;
  province?: string;
  country?: string;
  zipCode?: string;
  instructions?: string;
}

export interface User {
  id: string;
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  phone?: string;
  profileImage?: string;
  address?: Address;
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
  buttonLink?: string;
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

export type OrderStatus =
  | 'Pendiente'
  | 'Pendiente de Pago'
  | 'Pendiente de Confirmación'
  | 'Confirmado'
  | 'Enviado'
  | 'Entregado'
  | 'Cancelado';

export type PaymentMethod = 'Efectivo' | 'Transferencia Bancaria' | 'MercadoPago';

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  price: number;
  image: string;
}

export interface MercadoPagoPaymentDetails {
  paymentMethodId: string; // e.g., 'visa'
  paymentTypeId: string;   // e.g., 'credit_card'
  lastFourDigits?: string;
  installments?: number;
}

export interface Order {
  id: string;
  _id?: ObjectId;
  userId: string;
  user?: User;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  receiptUrl?: string;
  mercadoPagoPreferenceId?: string;
  mercadoPagoInitPoint?: string;
  mercadoPagoPaymentId?: string;
  mercadoPagoPaymentDetails?: MercadoPagoPaymentDetails;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  _id?: ObjectId;
  icon: any;
  title: string;
  description: string;
  details: string[];
  price: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppErrorLog {
  id: string;
  _id?: ObjectId;
  timestamp: string;
  path: string;
  functionName: string;
  errorMessage: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
  isResolved: boolean;
}

export type ActionResponse = {
  success: boolean;
  message: string;
  product?: Product | null;
  products?: Product[] | null;
  user?: User | null;
  slide?: HeroSlide | null;
  cart?: PopulatedCart | null;
  order?: Order | null;
  init_point?: string;
  shippingCost?: number;
  shippingMessage?: string;
  zone?: number;
};
