/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use client";

import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import ProductCard from '../products/product-card';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';

interface FeaturedProductsProps {
  products: Product[] | null;
  isAdmin?: boolean;
}

export default function FeaturedProducts({ products, isAdmin }: FeaturedProductsProps) {
  const { t } = useLanguage();

  if (!products) {
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
        <div className="flex flex-col items-center justify-center p-8 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30 rounded-xl text-center max-w-2xl mx-auto shadow-sm">
          <p className="text-amber-800 dark:text-amber-200 font-medium text-lg">
            {t('Featured_Products_Unavailable_Title')}
          </p>
          <p className="text-amber-700/80 dark:text-amber-300/80 text-sm mt-2 max-w-md">
            {t('Featured_Products_Unavailable_Desc')}
          </p>
        </div>
      </section>
    );
  }

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
