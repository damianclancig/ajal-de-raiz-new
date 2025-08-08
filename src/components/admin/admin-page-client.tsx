
"use client";

import ProductTable from "@/components/admin/product-table";
import { useLanguage } from "@/hooks/use-language";
import type { Product } from "@/lib/types";
import { Button } from "../ui/button";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "../ui/input";

interface AdminPageClientProps {
    initialProducts: Product[];
}

export default function AdminPageClient({ initialProducts }: AdminPageClientProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

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
                    className="pl-10"
                />
            </div>
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
      />
    </>
  );
}
