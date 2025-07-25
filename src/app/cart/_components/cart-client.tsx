
'use client';

import { useTransition } from 'react';
import { useCart } from '@/contexts/cart-context';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/lib/actions';
import { NO_IMAGE_URL } from '@/lib/utils';

export default function CartClient() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t, language } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const formatPrice = (price: number) => {
    const locale = language === 'es' ? 'es-AR' : language;
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleCreateOrder = () => {
    startTransition(async () => {
      const result = await createOrder();
      if(result.success) {
        toast({
          title: t('Order_Success_Title'),
          description: t('Order_Success_Desc'),
        });
      } else {
        toast({
          variant: 'destructive',
          title: t('Error_Title'),
          description: result.message || t('Order_Error_Desc'),
        });
      }
    });
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
                src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1753451875/Empty_Cart_i9oydd.png"
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
                        const imageUrl = (item.image || NO_IMAGE_URL).replace(/\.heic$/i, '.png');

                        return (
                            <div key={item.productId} className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4">
                                <div className="flex items-center gap-4 flex-grow w-full">
                                    <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src={imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 80px, 96px"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <Link href={`/products/${item.slug}`}>
                                            <h3 className="font-semibold hover:text-primary">{item.name}</h3>
                                        </Link>
                                        <p className="text-sm text-muted-foreground">${formatPrice(item.price)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 w-full md:w-auto mt-4 md:mt-0">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            max={item.countInStock}
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                                            className="w-20 text-center"
                                            aria-label={`Quantity for ${item.name}`}
                                        />
                                    </div>
                                    <div className="text-right font-medium w-24">
                                        ${formatPrice(item.price * item.quantity)}
                                    </div>
                                     <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productId)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                        <span className="sr-only">Remove {item.name}</span>
                                    </Button>
                                </div>
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
               <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="lg" className="w-full mt-4">{t('Proceed_to_Checkout')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('Payment_Method')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Por favor, selecciona tu método de pago. Por el momento solo aceptamos efectivo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={handleCreateOrder}
                        disabled={isPending}
                    >
                       {isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Wallet className="mr-2 h-4 w-4" />
                        )}
                       {t('Pay_in_Cash')}
                    </Button>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
               </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
