
"use client";

import ProductTable from "@/components/admin/product-table";
import { useLanguage } from "@/hooks/use-language";
import type { Product } from "@/lib/types";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

interface AdminPageClientProps {
    initialProducts: Product[];
}

export default function AdminPageClient({ initialProducts }: AdminPageClientProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-headline text-4xl font-bold">{t('Product_Management')}</h1>
          <p className="text-muted-foreground">{t('Manage_your_products_and_store_data')}</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('Add_New_Product')}
          </Link>
        </Button>
      </div>
      <ProductTable initialProducts={initialProducts} />
    </>
  );
}
