
import ProductForm from '@/components/admin/product-form';
import { getUniqueCategories } from '@/lib/product-service';

export default async function NewProductPage() {
  const categories = await getUniqueCategories();
  
  return (
    <div className="py-8">
      <ProductForm categories={categories} />
    </div>
  );
}
