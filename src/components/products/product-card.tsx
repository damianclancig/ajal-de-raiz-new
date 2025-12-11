

"use client"

import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn, formatPrice } from '@/lib/utils';
import { Badge } from '../ui/badge';

import { Pencil } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  size?: 'sm' | 'lg';
  onProductClick?: () => void;
  isAdmin?: boolean;
}

export default function ProductCard({ product, size = 'lg', onProductClick, isAdmin }: ProductCardProps) {
  const { language, t } = useLanguage();
  const isSoldOut = product.countInStock <= 0;

  const mediaUrl = product.images[0].replace(/\.heic$/i, '.png');
  const isVideo = /\.(mp4|webm)$/i.test(mediaUrl);

  const cardContent = (
    <>
      <CardHeader className="p-0">
        <div className={cn("relative aspect-square w-full", isSoldOut && "opacity-60")}>
          {isSoldOut && (
            <Badge variant="destructive" className="absolute top-2 left-2 z-10">
              {t('Sold_Out')}
            </Badge>
          )}
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
      <CardContent className={cn("flex-grow", size === 'lg' ? 'p-4' : 'p-3')}>
        <p className={cn("text-muted-foreground", size === 'lg' ? 'text-sm' : 'text-xs')}>{product.category}</p>
        <CardTitle className={cn("font-headline mt-1 leading-tight transition-colors hover:text-primary", size === 'lg' ? 'text-xl' : 'text-base')}>
          {product.name}
        </CardTitle>
      </CardContent>
      <CardFooter className={cn("pt-0",
        size === 'lg' ? 'p-4 flex justify-between items-center' : 'p-3 flex flex-col items-start gap-2'
      )}>
        <div className="flex flex-col">
          {product.oldPrice && product.oldPrice > 0 && (
            <span className={cn("text-muted-foreground", size === 'lg' ? 'text-sm' : 'text-xs')}>
              Antes: <span className="line-through">${formatPrice(product.oldPrice)}</span>
            </span>
          )}
          <p className={cn("font-bold text-primary", size === 'lg' ? 'text-lg' : 'text-base')}>${formatPrice(product.price)}</p>
        </div>
        <Button size="sm" variant="outline" className={cn(size === 'sm' && 'w-full')} tabIndex={-1}>
          {t('View_Details')}
        </Button>
      </CardFooter>
    </>
  );

  return (
    <Card className={cn(
      "flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group"
    )}>
      {isAdmin && (
        <Button
          asChild
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 z-50 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 bg-neutral-950/90 border-2 border-primary text-white shadow-[0_0_10px_hsl(var(--primary)/0.5)] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary))] hover:scale-105"
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/admin/products/${product.id}/edit`}>
            <Pencil className="w-4 h-4 stroke-2" />
            <span className="sr-only">Editar Producto</span>
          </Link>
        </Button>
      )}
      <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`} onClick={onProductClick} className="flex flex-col flex-grow">
        {cardContent}
      </Link>
    </Card>
  );
}

