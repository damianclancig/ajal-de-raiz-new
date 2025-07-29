
import { getOrderById } from '@/lib/order-service';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cookies } from 'next/headers';
import { translations } from '@/lib/translations';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import OrderStatusForm from './_components/order-status-form';
import { OrderStatus } from '@/lib/types';
import Link from 'next/link';

const getLanguage = () => {
    const cookieStore = cookies();
    const langCookie = cookieStore.get('language');
    const lang = langCookie?.value;
    if (lang === 'en' || lang === 'es' || lang === 'pt') {
        return lang;
    }
    return 'es'; 
};

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    const order = await getOrderById(params.id);

    if (!order) {
        notFound();
    }
    
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
            hour: '2-digit',
            minute: '2-digit',
        });
    };
     const getStatusVariant = (status: OrderStatus) => {
        switch (status) {
            case 'Pendiente': return 'secondary';
            case 'Pendiente de Pago': return 'destructive';
            case 'Pendiente de Confirmación': return 'default';
            case 'Confirmado': return 'default';
            case 'Enviado': return 'secondary';
            case 'Entregado': return 'secondary';
            case 'Cancelado': return 'destructive';
            default: return 'outline';
        }
    }
    
    return (
        <div className="space-y-6 px-4">
            <h1 className="font-headline text-4xl font-bold">Detalle de la Orden</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {order.receiptUrl && (
                        <Card className="border-primary">
                            <CardHeader>
                                <CardTitle>Comprobante de Pago</CardTitle>
                                <CardDescription>El cliente ha subido un comprobante para esta orden.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={order.receiptUrl} target="_blank" rel="noopener noreferrer">
                                    <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                                        <Image src={order.receiptUrl} alt="Comprobante de pago" fill className="object-contain" />
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle>Productos</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                    {order.items.map(item => (
                                        <TableRow key={item.productId}>
                                            <TableCell className="hidden md:table-cell">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-md object-cover"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell className="text-right">${formatPrice(item.price)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-6">
                    <Card>
                        <CardHeader>
                           <CardTitle>Resumen del Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">ID Pedido</span>
                                <span className="font-mono text-sm">{order.id.substring(0, 8)}...</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Fecha</span>
                                <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Estado</span>
                                <Badge variant={getStatusVariant(order.status)}>{t(order.status as keyof typeof translations)}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Método de Pago</span>
                                <Badge variant="outline">{t(order.paymentMethod as keyof typeof translations)}</Badge>
                            </div>
                            {order.mercadoPagoPaymentId && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">ID Pago MP</span>
                                    <span className="font-mono text-sm">{order.mercadoPagoPaymentId}</span>
                                </div>
                            )}
                             <div className="flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span>${formatPrice(order.totalPrice)}</span>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                           <CardTitle>Actualizar Estado</CardTitle>
                           <CardDescription>Modifica el estado actual del pedido.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrderStatusForm order={order} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
