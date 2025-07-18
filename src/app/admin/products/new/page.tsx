
import ProductForm from '@/components/admin/product-form';
import { useLanguage } from '@/hooks/use-language';

export default function NewProductPage() {
  
  return (
    <div className="py-8">
      <ProductForm />
    </div>
  );
}
