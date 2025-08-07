
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
    mercadoPagoPaymentId?: string;
    mercadoPagoPaymentDetails?: MercadoPagoPaymentDetails;
    mercadoPagoInitPoint?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  details: string[];
  price: string;
  note?: string;
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
