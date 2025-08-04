

import { getMyOrders } from '@/lib/order-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import { translations } from '@/lib/translations';
import Image from 'next/image';
import { NO_IMAGE_URL } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CreditCard, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';
import type { OrderStatus, MercadoPagoPaymentDetails } from '@/lib/types';
import UploadReceiptButton from './_components/upload-receipt-button';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import CancelOrderButton from './_components/cancel-order-button';

export const metadata: Metadata = {
  title: 'Mis Pedidos',
  description: 'Consulta el historial y el estado de todos tus pedidos en Ajal de Raiz.',
  robots: {
    index: false,
    follow: false,
  }
};

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
        <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Pago Confirmado
        </CardTitle>
        <CardDescription>Detalles de tu pago con MercadoPago.</CardDescription>
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
            case 'Cancelado': return 'outline';
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
                <Accordion type="multiple" className="space-y-4">
                    {orders.map((order) => (
                        <AccordionItem key={order.id} value={order.id} className="border rounded-lg bg-card shadow-sm">
                           <AccordionTrigger className="p-4 hover:no-underline">
                                <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 text-left">
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium">{t('Order_ID')}: {order.id.substring(0, 8)}...</p>
                                        <p className="text-xs text-muted-foreground">{t('Order_Date')}: {formatDate(order.createdAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-4 w-full justify-between md:w-auto md:justify-end">
                                        <Badge variant={getStatusVariant(order.status)}>{t(order.status as keyof typeof translations)}</Badge>
                                        <span className="font-bold text-lg text-right md:w-[120px]">${formatPrice(order.totalPrice)}</span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0">
                               <div className="border-t pt-4">
                                
                                <div className="mb-6 space-y-4">
                                     {order.paymentMethod === 'Efectivo' && order.status === 'Pendiente' && (
                                         <Alert>
                                           <Wallet className="h-4 w-4" />
                                           <AlertTitle>Pago en Efectivo</AlertTitle>
                                           <AlertDescription>
                                             Nos pondremos en contacto contigo a la brevedad para coordinar la entrega y el pago.
                                           </AlertDescription>
                                         </Alert>
                                     )}
                                    {order.status === 'Pendiente de Pago' && order.paymentMethod === 'Transferencia Bancaria' && (
                                       <Alert>
                                           <Info className="h-4 w-4" />
                                           <AlertTitle>{t('Complete_your_Payment')}</AlertTitle>
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
                                       </Alert>
                                    )}
                                    {order.status === 'Pendiente de Pago' && order.paymentMethod === 'MercadoPago' && (
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertTitle>{t('Complete_your_Payment')}</AlertTitle>
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
                                        </Alert>
                                    )}
                                    {order.status === 'Pendiente de Confirmación' && order.receiptUrl && (
                                        <Card className="bg-muted/50">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Comprobante Enviado</CardTitle>
                                                <CardDescription>Recibimos tu comprobante. Lo verificaremos a la brevedad.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Link href={order.receiptUrl} target="_blank" rel="noopener noreferrer">
                                                    <div className="relative aspect-video w-full max-w-xs mx-auto rounded-md overflow-hidden border">
                                                        <Image src={order.receiptUrl} alt="Comprobante de pago" fill className="object-contain" />
                                                    </div>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    )}
                                     {order.paymentMethod === 'MercadoPago' && order.mercadoPagoPaymentDetails && order.status !== 'Pendiente de Pago' && (
                                        <PaymentDetails details={order.mercadoPagoPaymentDetails} />
                                    )}
                                </div>
                               
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
                                                              sizes="64px"
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
                               
                                {order.status === 'Pendiente de Pago' && (
                                    <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
                                         <div className='flex flex-col md:flex-row items-center gap-4'>
                                            {order.paymentMethod === 'Transferencia Bancaria' && (
                                                <>
                                                    <p className="text-sm text-muted-foreground">{t('After_payment_instruction')}</p>
                                                    <UploadReceiptButton orderId={order.id} />
                                                </>
                                             )}
                                         </div>
                                         <CancelOrderButton orderId={order.id} />
                                    </div>
                                 )}
                               </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
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
