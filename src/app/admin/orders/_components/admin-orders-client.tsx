"use client";

import { useLanguage } from '@/hooks/use-language';
import type { Order } from '@/lib/types';
import OrdersTable from './orders-table';

interface AdminOrdersPageClientProps {
    orders: Order[];
}

export default function AdminOrdersPageClient({ orders }: AdminOrdersPageClientProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-headline text-4xl font-bold">{t('Orders_Admin')}</h1>
          <p className="text-muted-foreground">{t('Manage_your_orders_and_store_data')}</p>
        </div>
      </div>
      <OrdersTable orders={orders} />
    </>
  );
}
