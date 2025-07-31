
import CartClient from './_components/cart-client';
import { getCurrentUser } from '@/lib/user-service';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrito de Compras',
  description: 'Revisa los productos en tu carrito de compras y procede al pago de forma segura.',
  robots: {
    index: false, // No index cart pages
    follow: false,
  }
};

export default async function CartPage() {
  const user = await getCurrentUser();
  return <CartClient user={user} />;
}
