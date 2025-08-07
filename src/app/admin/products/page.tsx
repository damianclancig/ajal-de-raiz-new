
import { getPaginatedProducts } from "@/lib/actions";
import AdminPageClient from "@/components/admin/admin-page-client";

export const revalidate = 0;
const PRODUCTS_PER_PAGE = 20;

export default async function AdminProductsPage() {
  const result = await getPaginatedProducts({ offset: 0, limit: PRODUCTS_PER_PAGE });
  const products = result.products || [];

  return (
    <div>
      <AdminPageClient initialProducts={products} />
    </div>
  );
}
