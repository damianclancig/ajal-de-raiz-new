
"use client"

import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  size?: 'sm' | 'lg';
  onProductClick?: () => void;
}

export default function ProductCard({ product, size = 'lg', onProductClick }: ProductCardProps) {
  const { language, t } = useLanguage();

  const formatPrice = (price: number) => {
    const locale = language === 'es' ? 'es-AR' : language;
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const mediaUrl = product.images[0].replace(/\.heic$/i, '.png');
  const isVideo = /\.(mp4|webm)$/i.test(mediaUrl);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`} onClick={onProductClick}>
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full">
            {isVideo ? (
              <video
                src={mediaUrl}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={mediaUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                data-ai-hint={product.dataAiHint || 'product image'}
              />
            )}
          </div>
        </CardHeader>
      </Link>
      <CardContent className={cn("flex-grow", size === 'lg' ? 'p-4' : 'p-3')}>
        <p className={cn("text-muted-foreground", size === 'lg' ? 'text-sm' : 'text-xs')}>{product.category}</p>
        <Link href={`/products/${product.slug}`} onClick={onProductClick}>
            <CardTitle className={cn("font-headline mt-1 leading-tight hover:text-primary transition-colors", size === 'lg' ? 'text-xl' : 'text-base')}>
            {product.name}
            </CardTitle>
        </Link>
      </CardContent>
      <CardFooter className={cn("pt-0", 
        size === 'lg' ? 'p-4 flex justify-between items-center' : 'p-3 flex flex-col items-start gap-2'
      )}>
        <p className={cn("font-bold text-primary", size === 'lg' ? 'text-lg' : 'text-base')}>${formatPrice(product.price)}</p>
        <Button asChild size="sm" variant="outline" className={cn(size === 'sm' && 'w-full')}>
          <Link href={`/products/${product.slug}`} onClick={onProductClick}>
            {t("View_Details")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
