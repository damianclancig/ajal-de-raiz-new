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
