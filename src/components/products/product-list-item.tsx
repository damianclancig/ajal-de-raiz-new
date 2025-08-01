
"use client"

import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { NO_IMAGE_URL } from '@/lib/utils';
import { Card } from '../ui/card';
import { Eye } from 'lucide-react';

interface ProductListItemProps {
  product: Product;
  onProductClick?: () => void;
}

export default function ProductListItem({ product, onProductClick }: ProductListItemProps) {
  const { language, t } = useLanguage();

  const formatPrice = (price: number) => {
    const locale = language === 'es' ? 'es-AR' : language;
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const imageUrl = (product.images[0] || NO_IMAGE_URL).replace(/\.(mp4|webm)$/i, '.jpg');

  return (
    <Card className="flex items-center p-2 transition-all duration-300 hover:shadow-md hover:bg-muted/50 gap-2">
      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
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
          <h3 className="font-headline text-lg font-semibold hover:text-primary transition-colors truncate">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between">
            <p className="text-base font-bold text-primary">${formatPrice(product.price)}</p>
            <Button asChild size="icon" variant="ghost">
                <Link href={`/products/${product.slug}`} onClick={onProductClick}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">{t("View_Details")}</span>
                </Link>
            </Button>
        </div>
      </div>
    </Card>
  );
}
