
import { getPaginatedProducts } from "@/lib/actions";
import AdminPageClient from "@/components/admin/admin-page-client";
import { getUniqueCategories } from "@/lib/product-service";

export const revalidate = 0;
const PRODUCTS_PER_PAGE = 20;

export default async function AdminProductsPage() {
  const result = await getPaginatedProducts({ offset: 0, limit: PRODUCTS_PER_PAGE });
  const products = result.products || [];
  const categories = await getUniqueCategories();

  return (
    <div>
      <AdminPageClient initialProducts={products} categories={categories} />
    </div>
  );
}
