
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { Cart, Product, PopulatedCart } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { getCart, addToCart as addToCartAction, updateCartItemQuantity, removeFromCart as removeFromCartAction } from '@/lib/actions';

interface CartContextType {
  cart: PopulatedCart | null;
  loading: boolean;
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<PopulatedCart | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const fetchCart = async () => {
    if (status === 'authenticated') {
      setLoading(true);
      const userCart = await getCart();
      setCart(userCart);
      setLoading(false);
    } else {
      setCart(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [status]);

  const addToCart = async (product: Product, quantity: number) => {
    if (!session) return;
    const result = await addToCartAction(product.id, quantity);
    if (result.success && result.cart) {
      setCart(result.cart);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session) return;
    const result = await updateCartItemQuantity(productId, quantity);
    if (result.success && result.cart) {
      setCart(result.cart);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!session) return;
    const result = await removeFromCartAction(productId);
    if (result.success && result.cart) {
      setCart(result.cart);
    }
  };

  const clearCart = () => {
    // Implement clear cart functionality if needed
    // For now, this will just clear the local state
    setCart(null);
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
