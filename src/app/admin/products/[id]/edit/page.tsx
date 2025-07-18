
import ProductForm from '@/components/admin/product-form';
import { getProductById } from '@/lib/product-service';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }
  
  return (
    <div className="py-8">
      <ProductForm product={product} />
    </div>
  );
}
