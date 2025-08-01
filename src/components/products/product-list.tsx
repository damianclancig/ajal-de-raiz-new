
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import ProductCard from '@/components/products/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Grid3x3, List, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductListItem from './product-list-item';
import { Skeleton } from '../ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ProductListProps {
  products: Product[];
}

type ViewMode = 'grid-lg' | 'grid-sm' | 'list';

const SESSION_STORAGE_KEY = 'productListState';

export default function ProductList({ products }: ProductListProps) {
  const { t } = useLanguage();
  
  const [isInitialising, setIsInitialising] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('name_asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid-lg');

  const listRef = useRef<HTMLDivElement>(null);

  // Effect to load state from sessionStorage after initial render
  useEffect(() => {
    try {
        const savedSearchTerm = sessionStorage.getItem(`${SESSION_STORAGE_KEY}_searchTerm`) || '';
        const savedCategory = sessionStorage.getItem(`${SESSION_STORAGE_KEY}_category`) || 'All';
        const savedSortOrder = sessionStorage.getItem(`${SESSION_STORAGE_KEY}_sortOrder`) || 'name_asc';
        const savedViewMode = (sessionStorage.getItem(`${SESSION_STORAGE_KEY}_viewMode`) as ViewMode) || 'grid-lg';

        setSearchTerm(savedSearchTerm);
        setCategory(savedCategory);
        setSortOrder(savedSortOrder);
        setViewMode(savedViewMode);
    } catch (error) {
        console.error("Could not access session storage:", error);
    } finally {
        setIsInitialising(false); // End initialisation
    }
  }, []);

  // Effect to save state changes to sessionStorage
  useEffect(() => {
    if (isInitialising) return; // Don't save initial state until it's loaded
    try {
        sessionStorage.setItem(`${SESSION_STORAGE_KEY}_searchTerm`, searchTerm);
        sessionStorage.setItem(`${SESSION_STORAGE_KEY}_category`, category);
        sessionStorage.setItem(`${SESSION_STORAGE_KEY}_sortOrder`, sortOrder);
        sessionStorage.setItem(`${SESSION_STORAGE_KEY}_viewMode`, viewMode);
    } catch (error) {
        console.error("Could not access session storage:", error);
    }
  }, [searchTerm, category, sortOrder, viewMode, isInitialising]);
  
  // Effect to restore scroll position
  useEffect(() => {
    if (!isInitialising) {
        try {
            const scrollPosition = sessionStorage.getItem(`${SESSION_STORAGE_KEY}_scrollPos`);
            if (scrollPosition) {
                window.scrollTo(0, parseInt(scrollPosition, 10));
                sessionStorage.removeItem(`${SESSION_STORAGE_KEY}_scrollPos`);
            }
        } catch (error) {
            console.error("Could not access session storage:", error);
        }
    }
  }, [isInitialising]);


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

  const handleProductClick = () => {
    try {
        sessionStorage.setItem(`${SESSION_STORAGE_KEY}_scrollPos`, window.scrollY.toString());
    } catch (error) {
        console.error("Could not access session storage:", error);
    }
  };

  const ProductListSkeleton = () => (
    <div className={cn({
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8': viewMode === 'grid-lg',
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4': viewMode === 'grid-sm',
        'flex flex-col gap-4': viewMode === 'list',
    })}>
        {Array.from({ length: 8 }).map((_, i) => (
             <Skeleton key={i} className={cn(viewMode === 'list' ? 'h-24 w-full' : 'h-80 w-full')} />
        ))}
    </div>
);


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

      <div className="space-y-4">
        <Input
          placeholder={t('Search_products')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filters">
                 <AccordionTrigger>
                    <div className='flex items-center gap-2'>
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="text-sm font-medium">Filtros y Opciones de Vista</span>
                    </div>
                 </AccordionTrigger>
                 <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
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
                        <div className="flex items-center justify-center gap-1 bg-muted p-1 rounded-md">
                            <Button variant={viewMode === 'grid-lg' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid-lg')}>
                            <LayoutGrid className="h-5 w-5" />
                            </Button>
                            <Button variant={viewMode === 'grid-sm' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid-sm')}>
                            <Grid3x3 className="h-5 w-5" />
                            </Button>
                            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                            <List className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                 </AccordionContent>
            </AccordionItem>
        </Accordion>
      </div>
      
      {isInitialising ? (
         <ProductListSkeleton />
      ) : (
        <div ref={listRef} className={cn({
            'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8': viewMode === 'grid-lg',
            'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4': viewMode === 'grid-sm',
            'flex flex-col gap-4': viewMode === 'list',
        })}>
          {filteredAndSortedProducts.map(product => 
              viewMode === 'list' ? (
                <ProductListItem key={product.id} product={product} onProductClick={handleProductClick} />
              ) : (
                <ProductCard key={product.id} product={product} size={viewMode === 'grid-sm' ? 'sm' : 'lg'} onProductClick={handleProductClick} />
              )
          )}
        </div>
      )}
    </div>
  );
}
