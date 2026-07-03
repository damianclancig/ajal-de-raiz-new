/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { useLanguage } from '@/hooks/use-language';
import { Order, OrderStatus } from '@/lib/types';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateOrderStatus } from '@/lib/actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { translations } from '@/lib/translations';

interface OrderStatusFormProps {
    order: Order;
}

export default function OrderStatusForm({ order }: OrderStatusFormProps) {
    const { t } = useLanguage();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    
    const statuses: OrderStatus[] = ['Pendiente', 'Pendiente de Pago', 'Pendiente de Confirmación', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'];

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await updateOrderStatus(order.id, formData);
            if (result.success) {
                toast({
                    title: "Estado Actualizado",
                    description: "El estado del pedido ha sido actualizado.",
                });
            } else {
                 toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive"
                });
            }
        });
    }

    return (
        <form action={handleSubmit}>
            <div className="space-y-4">
                <Select name="status" defaultValue={order.status}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('Select_a_state')} />
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.map(status => (
                            <SelectItem key={status} value={status}>
                                {t(status as keyof typeof translations)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : t('Save')}
                </Button>
            </div>
        </form>
    );
}
