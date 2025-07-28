
"use client"

import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
      <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}>
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={product.dataAiHint || 'product image'}
              />
            )}
          </div>
        </CardHeader>
      </Link>
      <CardContent className="flex-grow p-4">
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <Link href={`/products/${product.slug}`}>
            <CardTitle className="font-headline text-xl mt-1 leading-tight hover:text-primary transition-colors">
            {product.name}
            </CardTitle>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-lg font-bold text-primary">${formatPrice(product.price)}</p>
        <Button asChild size="sm" variant="outline">
          <Link href={`/products/${product.slug}`}>
            {t("View_Details")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
