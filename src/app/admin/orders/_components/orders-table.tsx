

'use client';

import { useLanguage } from '@/hooks/use-language';
import { Order } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { formatDate, formatPrice, getStatusVariant } from '@/lib/utils';


interface OrdersTableProps {
    orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
    const { t, language } = useLanguage();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="hidden md:table-header-group">
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>ID / Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="w-[100px] text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className={cn("flex flex-col md:table-row p-4 md:p-0 border-b even:bg-muted/25", order.status === 'Pendiente de Confirmación' && 'bg-primary/10')}>
                                <TableCell className="p-0 md:p-4 flex justify-between items-center">
                                    <div className="font-medium">
                                        <div className="md:hidden text-xs text-muted-foreground mb-2">Cliente</div>
                                        <div>{order.user?.name || 'Usuario no encontrado'}</div>
                                        <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                                    </div>
                                    <div className="md:hidden">
                                        <Button asChild variant="ghost" size="icon">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">Ver Orden</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="p-0 md:p-4 mt-2 md:mt-0">
                                    <div className="md:hidden text-xs text-muted-foreground mb-1">ID / Fecha</div>
                                    <div className="font-mono text-sm">{order.id.substring(0, 8)}...</div>
                                    <div className="text-xs text-muted-foreground">
                                        {isClient ? formatDate(order.createdAt, language) : <Loader2 className="h-4 w-4 animate-spin" />}
                                    </div>
                                </TableCell>
                                <TableCell className="p-0 md:p-4 mt-2 md:mt-0">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="md:hidden text-xs text-muted-foreground mb-1">Estado</div>
                                            <Badge variant={getStatusVariant(order.status)}>
                                                {t(order.status as keyof typeof translations)}
                                            </Badge>
                                        </div>
                                        <div className="text-right font-bold md:hidden">
                                            <div className="text-xs text-muted-foreground font-normal mb-1">Total</div>
                                            {isClient ? `$${formatPrice(order.totalPrice, language)}` : <Loader2 className="h-4 w-4 animate-spin" />}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-right">
                                    {isClient ? `$${formatPrice(order.totalPrice, language)}` : <Loader2 className="h-4 w-4 animate-spin" />}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-right">
                                    <Button asChild variant="ghost" size="icon">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">Ver Orden</span>
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
