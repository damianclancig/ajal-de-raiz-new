
import { getMyOrders } from '@/lib/order-service';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import { translations } from '@/lib/translations';
import Image from 'next/image';
import { NO_IMAGE_URL } from '@/lib/utils';

const getLanguage = () => {
    const cookieStore = cookies();
    const langCookie = cookieStore.get('language');
    const lang = langCookie?.value;
    if (lang === 'en' || lang === 'es' || lang === 'pt') {
        return lang;
    }
    return 'es'; 
};


export default async function OrdersPage() {
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

    return (
        <div className="container py-8 md:py-12">
            <h1 className="font-headline text-4xl font-bold mb-8">{t('My_Orders')}</h1>
            
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
                                    <Badge variant={order.status === 'Pendiente' ? 'secondary' : 'default'}>{t(order.status as keyof typeof translations)}</Badge>
                                    <span className="font-bold text-lg">${formatPrice(order.totalPrice)}</span>
                                </div>
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
                                                        src={item.image || NO_IMAGE_URL}
                                                        alt={item.name}
                                                        width={64}
                                                        height={64}
                                                        className="rounded-md object-cover"
                                                        data-ai-hint="product image"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={`/products/${item.slug}`} className="font-medium hover:text-primary">
                                                        {item.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell className="text-right">${formatPrice(item.price)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                               </Table>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
