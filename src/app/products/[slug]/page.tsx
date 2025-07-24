
import { getProductBySlug } from '@/lib/product-service';
import { notFound } from 'next/navigation';
import ProductDetailClient from './_components/product-detail-client';
import type { Product } from '@/lib/types';

// This is a Server Component that fetches data.
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product: Product | null = await getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }
  
  // It passes the fetched data to a Client Component.
  return <ProductDetailClient product={product} />;
}
