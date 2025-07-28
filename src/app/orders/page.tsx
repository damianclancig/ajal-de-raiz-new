
import { getMyOrders } from '@/lib/order-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import { translations } from '@/lib/translations';
import Image from 'next/image';
import { NO_IMAGE_URL } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import type { OrderStatus, MercadoPagoPaymentDetails } from '@/lib/types';
import UploadReceiptButton from './_components/upload-receipt-button';
import { Suspense } from 'react';

// Revalidate this page every 30 seconds to get live order status updates
export const revalidate = 30;

const getLanguage = () => {
    const cookieStore = cookies();
    const langCookie = cookieStore.get('language');
    const lang = langCookie?.value;
    if (lang === 'en' || lang === 'es' || lang === 'pt') {
        return lang;
    }
    return 'es'; 
};

const bankDetails = {
    alias: process.env.BANK_ALIAS,
    cbu: process.env.BANK_CBU,
    cuit: process.env.BANK_CUIT,
    accountName: process.env.BANK_ACCOUNT_NAME
};

function StatusAlert({ status }: { status: string | undefined }) {
    const lang = getLanguage();
    const t = (key: keyof typeof translations) => translations[key][lang] || key;

    if (status === 'success') {
        return (
            <Alert variant="default" className="bg-green-100 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200 mb-6">
                <CheckCircle2 className="h-4 w-4 !text-green-600 dark:!text-green-400" />
                <AlertTitle className="font-bold">¡Pago Aprobado!</AlertTitle>
                <AlertDescription>
                    Tu pago fue procesado con éxito. Tu pedido ha sido confirmado.
                </AlertDescription>
            </Alert>
        );
    }

    if (status === 'failure') {
        return (
            <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Pago Fallido</AlertTitle>
                <AlertDescription>
                    Hubo un problema con tu pago. Por favor, revisa los detalles de tu pedido e inténtalo de nuevo.
                </AlertDescription>
            </Alert>
        );
    }
    
    if (status === 'pending') {
         return (
            <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Pago Pendiente</AlertTitle>
                <AlertDescription>
                   Tu pago está pendiente de procesamiento. Te notificaremos cuando se complete.
                </AlertDescription>
            </Alert>
        );
    }

    return null;
}

function PaymentDetails({ details }: { details: MercadoPagoPaymentDetails }) {
  const lang = getLanguage();
  const t = (key: keyof typeof translations) => translations[key][lang] || key;

  const formatPaymentMethod = (method: string) => {
    return method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  return (
    <Card className="mb-6 bg-muted/50">
      <CardHeader>
        <CardTitle className="text-lg">Detalles del Pago</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold">Método</p>
          <p className="capitalize">{formatPaymentMethod(details.paymentMethodId)}</p>
        </div>
        <div>
          <p className="font-semibold">Tipo</p>
          <p className="capitalize">{formatPaymentMethod(details.paymentTypeId)}</p>
        </div>
        {details.lastFourDigits && (
          <div>
            <p className="font-semibold">Tarjeta</p>
            <p>•••• {details.lastFourDigits}</p>
          </div>
        )}
        {details.installments && (
          <div>
            <p className="font-semibold">Cuotas</p>
            <p>{details.installments}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

async function OrdersContent({ searchParams }: { searchParams: { status?: string } }) {
    const orders = await getMyOrders();
    const lang = getLanguage();
    const t = (key: keyof typeof translations) => translations[key][lang] || key;

    const formatPrice = (price: number) => {
        const locale = lang === 'es' ? 'es-AR' : lang;
        return new Intl.NumberFormat(locale, {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };
    
    const formatDate = (dateString: string) => {
        const locale = lang === 'es' ? 'es-AR' : lang;
        return new Date(dateString).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    
    const getStatusVariant = (status: OrderStatus) => {
        switch (status) {
            case 'Pendiente': return 'secondary';
            case 'Pendiente de Pago': return 'destructive';
            case 'Pendiente de Confirmación': return 'default';
            case 'Confirmado': return 'default';
            case 'Enviado': return 'default';
            case 'Entregado': return 'default';
            case 'Cancelado': return 'destructive';
            default: return 'outline';
        }
    }


    return (
        <div className="container py-8 md:py-12">
            <h1 className="font-headline text-4xl font-bold mb-8">{t('My_Orders')}</h1>
            
            <StatusAlert status={searchParams.status} />

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-xl mb-4">{t('You_have_no_orders_yet')}</p>
                    <p className="text-muted-foreground mb-6">{t('Browse_our_products_and_start_shopping')}</p>
                    <Button asChild>
                        <Link href="/products">{t('Go_Shopping')}</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center">
                                <div className='mb-4 md:mb-0'>
                                    <CardTitle className="text-xl">{t('Order_ID')}: {order.id.substring(0, 8)}...</CardTitle>
                                    <CardDescription>{t('Order_Date')}: {formatDate(order.createdAt)}</CardDescription>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <Badge variant={getStatusVariant(order.status)}>{t(order.status as keyof typeof translations)}</Badge>
                                    <span className="font-bold text-lg">${formatPrice(order.totalPrice)}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                               {order.status === 'Pendiente de Pago' && (
                                   <Alert className="mb-6">
                                       <Info className="h-4 w-4" />
                                       <AlertTitle>{t('Complete_your_Payment')}</AlertTitle>
                                       {order.paymentMethod === 'Transferencia Bancaria' && (
                                           <AlertDescription>
                                               <div className="space-y-2 mt-2">
                                                    <p>{t('Transfer_Instruction')}</p>
                                                    <p className="font-semibold">{t('Total_Amount')}: <span className="font-bold text-lg">${formatPrice(order.totalPrice)}</span></p>
                                                    <ul className="list-disc list-inside space-y-1 text-sm bg-muted p-3 rounded-md">
                                                        {bankDetails.alias && <li><strong>{t('Alias')}:</strong> {bankDetails.alias}</li>}
                                                        {bankDetails.cbu && <li><strong>CBU/CVU:</strong> {bankDetails.cbu}</li>}
                                                        {bankDetails.cuit && <li><strong>CUIT:</strong> {bankDetails.cuit}</li>}
                                                        {bankDetails.accountName && <li><strong>{t('Account_Holder')}:</strong> {bankDetails.accountName}</li>}
                                                    </ul>
                                               </div>
                                           </AlertDescription>
                                       )}
                                       {order.paymentMethod === 'MercadoPago' && (
                                            <AlertDescription>
                                                <div className="space-y-2 mt-2">
                                                    <p>{t('MercadoPago_Instruction')}</p>
                                                    {order.mercadoPagoInitPoint && (
                                                        <Button asChild className="mt-2">
                                                            <Link href={order.mercadoPagoInitPoint}>
                                                                <CreditCard className="mr-2 h-4 w-4" />
                                                                {t('Pay_Now')}
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </AlertDescription>
                                       )}
                                   </Alert>
                               )}

                                {order.paymentMethod === 'MercadoPago' && order.mercadoPagoPaymentDetails && order.status !== 'Pendiente de Pago' && (
                                    <PaymentDetails details={order.mercadoPagoPaymentDetails} />
                                )}

                               <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px] hidden md:table-cell">Imagen</TableHead>
                                            <TableHead>Producto</TableHead>
                                            <TableHead>Cantidad</TableHead>
                                            <TableHead className="text-right">Precio</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map(item => {
                                            const imageUrl = item.image 
                                                ? (item.image || NO_IMAGE_URL).replace(/\.(mp4|webm)$/i, '.jpg')
                                                : NO_IMAGE_URL;

                                            return (
                                                <TableRow key={item.productId}>
                                                    <TableCell className="hidden md:table-cell">
                                                        <div className="relative aspect-square w-16 h-16">
                                                          <Image
                                                              src={imageUrl}
                                                              alt={item.name}
                                                              fill
                                                              className="rounded-md object-cover"
                                                          />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link href={`/products/${item.slug}`} className="font-medium hover:text-primary">
                                                            {item.name}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell className="text-right">${formatPrice(item.price)}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                               </Table>
                            </CardContent>
                             {order.status === 'Pendiente de Pago' && order.paymentMethod === 'Transferencia Bancaria' && (
                                <CardFooter className="flex-col items-start gap-2 pt-4">
                                     <p className="text-sm text-muted-foreground">{t('After_payment_instruction')}</p>
                                     <UploadReceiptButton orderId={order.id} />
                                </CardFooter>
                             )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function OrdersPage({ searchParams }: { searchParams: { status?: string } }) {
    return (
        <Suspense fallback={<div>Loading orders...</div>}>
            <OrdersContent searchParams={searchParams} />
        </Suspense>
    );
}
