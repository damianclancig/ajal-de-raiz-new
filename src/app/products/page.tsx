import ProductList from "@/components/products/product-list";
import { getAvailableProducts } from "@/lib/product-service";

export default async function ProductsPage() {
  const products = await getAvailableProducts();
  return (
    <div className="container py-8">
      <ProductList products={products} />
    </div>
  );
}
