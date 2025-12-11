"use client";

import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import ProductCard from '../products/product-card';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';

interface FeaturedProductsProps {
  products: Product[];
  isAdmin?: boolean;
}

export default function FeaturedProducts({ products, isAdmin }: FeaturedProductsProps) {
  const { t } = useLanguage();

  return (
    <section className="container">
      <div className="text-center mb-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">
          {t('Featured_Products')}
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          {t('Hand_picked_for_your_home_and_garden')}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} isAdmin={isAdmin} />
        ))}
      </div>
      <div className="text-center mt-12">
        <Button asChild variant="outline" size="lg">
          <Link href="/products">
            {t('View_All_Products')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
