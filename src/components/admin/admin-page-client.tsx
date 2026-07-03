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

import ProductTable from "@/components/admin/product-table";
import { useLanguage } from "@/hooks/use-language";
import type { Product } from "@/lib/types";
import { Button } from "../ui/button";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface AdminPageClientProps {
    initialProducts: Product[];
    categories: string[];
}

export default function AdminPageClient({ initialProducts, categories }: AdminPageClientProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-headline text-4xl font-bold">{t('Product_Management')}</h1>
          <p className="text-muted-foreground">{t('Manage_your_products_and_store_data')}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t('Search_products')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-auto"
                />
            </div>
             <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('Filter_by_category')} />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                            {cat === 'All' ? t(cat as 'All') : cat}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button asChild>
            <Link href="/admin/products/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('Add_New_Product')}
            </Link>
            </Button>
        </div>
      </div>
      <ProductTable 
        initialProducts={initialProducts} 
        searchTerm={searchTerm} 
        category={category}
      />
    </>
  );
}
