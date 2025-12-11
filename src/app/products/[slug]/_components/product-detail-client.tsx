

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import type { Product } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/cart-context';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import CareInstructions from '@/components/products/care-instructions';

import { Pencil } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailClient({ product, isAdmin }: { product: Product, isAdmin?: boolean }) {
  const [selectedMedia, setSelectedMedia] = useState<string>(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();

  const isVideo = (url: string) => /\.(mp4|webm)$/i.test(url);

  const handleAddToCart = () => {
    if (!session) {
      router.push('/login');
      return;
    }
    if (product) {
      addToCart(product, quantity);
      toast({
        title: t('Product_Added_to_Cart_Title'),
        description: t('Product_Added_to_Cart_Desc', { quantity, name: product.name }),
      });
    }
  };

  if (!product) {
    return <div>Loading...</div>; // Or a more sophisticated skeleton loader
  }

  const isSoldOut = product.countInStock <= 0;

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg bg-muted/20">
            {isVideo(selectedMedia) ? (
              <video
                key={selectedMedia}
                src={selectedMedia}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-contain"
              >
                Tu navegador no soporta el tag de video.
              </video>
            ) : (
              <Image
                src={selectedMedia.replace(/\.heic$/i, '.png')}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                data-ai-hint={product.dataAiHint || 'product image'}
              />
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMedia(media)}
                  className={cn(
                    "relative aspect-square w-full rounded-md overflow-hidden ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring",
                    selectedMedia === media && 'ring-2 ring-primary'
                  )}
                >
                  <Image
                    src={media.replace(/\.heic$/i, '.png').replace(/\.(mp4|webm)$/i, '.jpg')}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="20vw"
                  />
                  {isVideo(media) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-start gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-headline text-4xl md:text-5xl">{product.name}</CardTitle>
                    {isAdmin && (
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar Producto</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                <Badge variant={!isSoldOut ? "default" : "destructive"}>
                  {!isSoldOut ? t('Available') : t('Sold_Out')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground whitespace-pre-line">{product.description}</p>

              <div className="flex flex-col items-end">
                {product.oldPrice && product.oldPrice > 0 && (
                  <span className="text-2xl text-muted-foreground">
                    Antes: <span className="line-through">${formatPrice(product.oldPrice)}</span>
                  </span>
                )}
                <div className="text-4xl font-bold text-primary">
                  ${formatPrice(product.price)}
                </div>
              </div>

              {isSoldOut ? (
                <Button size="lg" className="w-full" disabled>{t('Sold_Out')}</Button>
              ) : session ? (
                <div className="flex gap-4">
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.countInStock, Number(e.target.value))))}
                    min="1"
                    max={product.countInStock}
                    className="w-24 text-center"
                  />
                  <Button size="lg" className="w-full" onClick={handleAddToCart}>
                    {t('Add_to_Cart')}
                  </Button>
                </div>
              ) : (
                <Button size="lg" className="w-full" onClick={handleAddToCart}>
                  {t('Login_to_Buy')}
                </Button>
              )}
            </CardContent>
          </Card>
          {product.care && (
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-headline">Cuidados Esenciales</AccordionTrigger>
                <AccordionContent>
                  <CareInstructions text={product.care} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}
