
'use client';

import { useLanguage } from '@/hooks/use-language';
import { Order, OrderStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import { useState, useEffect } from 'react';

interface OrdersTableProps {
    orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
    const { t, language } = useLanguage();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const formatDate = (dateString: string) => {
        const locale = language === 'es' ? 'es-AR' : language;
        return new Date(dateString).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number) => {
        const locale = language === 'es' ? 'es-AR' : language;
        return new Intl.NumberFormat(locale, {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
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
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID Pedido</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className={order.status === 'Pendiente de Confirmación' ? 'bg-primary/10' : ''}>
                                <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                                <TableCell>
                                    <div>{order.user?.name || 'Usuario no encontrado'}</div>
                                    <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                                </TableCell>
                                <TableCell>
                                    {isClient ? formatDate(order.createdAt) : <Loader2 className="h-4 w-4 animate-spin" />}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(order.status)}>
                                        {t(order.status as keyof typeof translations)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {isClient ? `$${formatPrice(order.totalPrice)}` : <Loader2 className="h-4 w-4 animate-spin" />}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="ghost" size="icon">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
