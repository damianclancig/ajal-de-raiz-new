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


import ProductList from "@/components/products/product-list";
import { getPaginatedProducts } from "@/lib/actions";
import { getUniqueCategories } from "@/lib/product-service";
import type { Metadata } from 'next';
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catálogo de Productos',
  description: 'Explora nuestro catálogo completo de plantas, macetas, herramientas y suministros de jardinería. Encuentra todo lo que necesitas para tu espacio verde.',
};

const PRODUCTS_PER_PAGE = 12;

function ProductListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    </div>
  )
}
import { auth } from "@/auth";

export default async function ProductsPage() {
  const session = await auth();
  // We fetch initial data to pass to the component.
  // The component itself will re-fetch based on URL params on the client side.
  const result = await getPaginatedProducts({ offset: 0, limit: PRODUCTS_PER_PAGE, state: 'activo' });
  const products = result.products || [];
  const categories = await getUniqueCategories();

  return (
    <div className="container py-8">
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList products={products} initialCategories={categories} isAdmin={session?.user?.isAdmin} />
      </Suspense>
    </div>
  );
}
