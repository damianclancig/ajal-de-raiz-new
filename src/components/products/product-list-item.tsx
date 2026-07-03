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



"use client"

import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { NO_IMAGE_URL, formatPrice } from '@/lib/utils';
import { Card } from '../ui/card';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductListItemProps {
  product: Product;
  onProductClick?: () => void;
}

export default function ProductListItem({ product, onProductClick }: ProductListItemProps) {
  const { language, t } = useLanguage();
  const isSoldOut = product.countInStock <= 0;

  const imageUrl = (product.images[0] || NO_IMAGE_URL).replace(/\.(mp4|webm)$/i, '.jpg');

  return (
    <Card className={cn(
        "flex items-center p-2 transition-all duration-300 gap-2 hover:shadow-md hover:bg-muted/50",
        isSoldOut && "bg-muted/50"
    )}>
      <div className={cn("relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0", isSoldOut && "opacity-60")}>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="80px"
          data-ai-hint={product.dataAiHint || 'product image'}
        />
      </div>
      <div className="flex-grow text-left w-full min-w-0">
        <p className="text-xs text-muted-foreground truncate">{product.category}</p>
        <Link href={`/products/${product.slug}`} onClick={onProductClick}>
          <h3 className="font-headline text-lg font-semibold transition-colors hover:text-primary truncate">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between">
            <p className="text-base font-bold text-primary">${formatPrice(product.price, language)}</p>
            {isSoldOut ? (
                <span className="text-sm font-semibold text-destructive">{t('Sold_Out')}</span>
            ) : (
                <Button asChild size="icon" variant="ghost">
                    <Link href={`/products/${product.slug}`} onClick={onProductClick}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">{t("View_Details")}</span>
                    </Link>
                </Button>
            )}
        </div>
      </div>
    </Card>
  );
}
