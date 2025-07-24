
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

// This is a Client Component that handles user interaction (state).
export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState<string>(product.images?.[0] || 'https://placehold.co/600x600.png');
  const { t, language } = useLanguage();

  const formatPrice = (price: number) => {
    const locale = language === 'es' ? 'es-AR' : language;
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };
  
  if (!product) {
    return <div>Loading...</div>; // Or a more sophisticated skeleton loader
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src={selectedImage.replace(/\.heic$/i, '.png')}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              data-ai-hint={product.dataAiHint || 'product image'}
            />
          </div>
          {product.images && product.images.length > 1 && (
             <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                          "relative aspect-square w-full rounded-md overflow-hidden ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring",
                          selectedImage === img && 'ring-2 ring-primary'
                        )}
                    >
                        <Image
                            src={img.replace(/\.heic$/i, '.png')}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="20vw"
                        />
                    </button>
                ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
            <Card>
                <CardHeader>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <CardTitle className="font-headline text-4xl md:text-5xl">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-lg text-muted-foreground">{product.description}</p>
                    
                    <div className="text-4xl font-bold text-primary">
                        ${formatPrice(product.price)}
                    </div>

                    <Button size="lg" className="w-full">
                        {t('Contact_Us')}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
