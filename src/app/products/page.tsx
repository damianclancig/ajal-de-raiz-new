
import ProductList from "@/components/products/product-list";
import { getPaginatedProducts } from "@/lib/actions";
import { getUniqueCategories } from "@/lib/product-service";
import type { Metadata } from 'next';
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

export default async function ProductsPage() {
  // We fetch initial data to pass to the component.
  // The component itself will re-fetch based on URL params on the client side.
  const result = await getPaginatedProducts({ offset: 0, limit: PRODUCTS_PER_PAGE, state: 'activo' });
  const products = result.products || [];
  const categories = await getUniqueCategories();

  return (
    <div className="container py-8">
       <Suspense fallback={<ProductListSkeleton />}>
        <ProductList products={products} initialCategories={categories} />
       </Suspense>
    </div>
  );
}
