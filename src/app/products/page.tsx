
import ProductList from "@/components/products/product-list";
import { getPaginatedProducts } from "@/lib/actions";
import { getUniqueCategories } from "@/lib/product-service";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de Productos',
  description: 'Explora nuestro catálogo completo de plantas, macetas, herramientas y suministros de jardinería. Encuentra todo lo que necesitas para tu espacio verde.',
};

const PRODUCTS_PER_PAGE = 12;

export default async function ProductsPage() {
  const result = await getPaginatedProducts({ offset: 0, limit: PRODUCTS_PER_PAGE, state: 'activo' });
  const products = result.products || [];
  const categories = await getUniqueCategories();

  return (
    <div className="container py-8">
      <ProductList products={products} initialCategories={categories} />
    </div>
  );
}
