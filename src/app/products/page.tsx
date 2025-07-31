import ProductList from "@/components/products/product-list";
import { getAvailableProducts } from "@/lib/product-service";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de Productos',
  description: 'Explora nuestro catálogo completo de plantas, macetas, herramientas y suministros de jardinería. Encuentra todo lo que necesitas para tu espacio verde.',
};

export default async function ProductsPage() {
  const products = await getAvailableProducts();
  return (
    <div className="container py-8">
      <ProductList products={products} />
    </div>
  );
}
