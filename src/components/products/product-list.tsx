"use client";

import React, { useState, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import ProductCard from '@/components/products/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('name_asc');

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return ['All', ...uniqueCategories];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  }, [products, category, searchTerm, sortOrder]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
          {t('Our_Collection')}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('Browse_our_wide_selection_of_plants_and_supplies')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder={t('Search_products')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="md:col-span-1"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
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
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('Sort_by')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">{t('Name_A_Z')}</SelectItem>
            <SelectItem value="name_desc">{t('Name_Z_A')}</SelectItem>
            <SelectItem value="price_asc">{t('Price_Low_to_High')}</SelectItem>
            <SelectItem value="price_desc">{t('Price_High_to_Low')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {filteredAndSortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
