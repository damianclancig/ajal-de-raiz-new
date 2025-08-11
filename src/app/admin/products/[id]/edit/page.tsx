
import ProductForm from '@/components/admin/product-form';
import { getProductById, getUniqueCategories } from '@/lib/product-service';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getUniqueCategories()
  ]);

  if (!product) {
    notFound();
  }
  
  return (
    <div className="py-8">
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
