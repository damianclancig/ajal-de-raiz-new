
import { getAllProducts } from "@/lib/product-service";
import AdminPageClient from "@/components/admin/admin-page-client";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <AdminPageClient initialProducts={products} />
    </div>
  );
}

    