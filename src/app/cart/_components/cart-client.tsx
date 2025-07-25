
'use client';

import { useCart } from '@/contexts/cart-context';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartClient() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t, language } = useLanguage();
  
  const formatPrice = (price: number) => {
    const locale = language === 'es' ? 'es-AR' : language;
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-20rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-12 text-center flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
            <Image
                src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1715124262/jy2jyjqs1hj03is7xhln.png"
                alt="Empty shopping cart"
                layout="fill"
                objectFit="contain"
                data-ai-hint="empty cart"
            />
        </div>
        <h1 className="font-headline text-3xl mb-4">{t('Your_cart_is_empty')}</h1>
        <p className="text-muted-foreground mb-6">{t('Looks_like_you_havent_added_anything')}</p>
        <Button asChild>
          <Link href="/products">{t('Go_Shopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="font-headline text-4xl font-bold mb-8">{t('Shopping_Cart')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                    {cart.items.map(item => {
                        const imageUrl = item.image 
                            ? item.image.replace(/\.heic$/i, '.png')
                            : 'https://placehold.co/600x600/a1a1a1/000000/jpg?text=No+Image';

                        return (
                            <div key={item.productId} className="flex items-center p-4 gap-4">
                                <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="100px"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <Link href={`/products/${item.slug}`}>
                                        <h3 className="font-semibold hover:text-primary">{item.name}</h3>
                                    </Link>
                                    <p className="text-sm text-muted-foreground">${formatPrice(item.price)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        min="1"
                                        max={item.countInStock}
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                                        className="w-20 text-center"
                                    />
                                </div>
                                <div className="text-right font-medium w-24">
                                    ${formatPrice(item.price * item.quantity)}
                                </div>
                                 <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productId)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        )
                    })}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('Order_Summary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{t('Subtotal')}</span>
                <span>${formatPrice(cart.totalPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>{t('Total')}</span>
                <span>${formatPrice(cart.totalPrice)}</span>
              </div>
              <Button size="lg" className="w-full mt-4">{t('Proceed_to_Checkout')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
