
import CartClient from './_components/cart-client';
import { getCurrentUser } from '@/lib/user-service';

export default async function CartPage() {
  const user = await getCurrentUser();
  return <CartClient user={user} />;
}
