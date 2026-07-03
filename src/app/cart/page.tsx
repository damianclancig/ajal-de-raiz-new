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
