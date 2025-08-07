
"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import ProductCard from '@/components/products/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Grid3x3, List, SlidersHorizontal, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductListItem from './product-list-item';
import { Skeleton } from '../ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useInView } from 'react-intersection-observer';
import { getPaginatedProducts } from '@/lib/actions';

const PRODUCTS_PER_PAGE = 12;

interface ProductListProps {
  products: Product[];
  initialCategories: string[];
}

type ViewMode = 'grid-lg' | 'grid-sm' | 'list';

const SESSION_STORAGE_KEY = 'productListState';

export default function ProductList({ products: initialProducts, initialCategories }: ProductListProps) {
  const { t } = useLanguage();
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [offset, setOffset] = useState(initialProducts.length);
  const [hasMore, setHasMore] = useState(initialProducts.length === PRODUCTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('name_asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid-lg');

  const { ref: loadMoreRef, inView } = useInView();
  const listRef = useRef<HTMLDivElement>(null);

  // Restore state from sessionStorage on component mount
  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedState) {
        const { searchTerm, category, sortOrder, viewMode } = JSON.parse(savedState);
        setSearchTerm(searchTerm || '');
        setCategory(category || 'All');
        setSortOrder(sortOrder || 'name_asc');
        setViewMode(viewMode || 'grid-lg');
      }
    } catch (e) {
      console.error("Failed to parse session storage state", e);
    }
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = { searchTerm, category, sortOrder, viewMode };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to set session storage state", e);
    }
  }, [searchTerm, category, sortOrder, viewMode]);


  const loadProducts = useCallback(async (isNewSearch = false) => {
    setIsLoading(true);
    const currentOffset = isNewSearch ? 0 : offset;
    
    const result = await getPaginatedProducts({
      limit: PRODUCTS_PER_PAGE,
      offset: currentOffset,
      searchTerm,
      category,
      sortOrder
    });

    if (result.success && result.products) {
      if (isNewSearch) {
        setProducts(result.products);
      } else {
        setProducts(prev => [...prev, ...result.products!]);
      }
      setOffset(currentOffset + result.products.length);
      setHasMore(result.products.length === PRODUCTS_PER_PAGE);
    }
    setIsLoading(false);
  }, [offset, searchTerm, category, sortOrder]);


  // Effect to load more products when the sentinel is in view
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      loadProducts();
    }
  }, [inView, isLoading, hasMore, loadProducts]);


  // Effect to handle new searches when filters change
  useEffect(() => {
    const handler = setTimeout(() => {
        loadProducts(true);
    }, 300); // Debounce
    return () => clearTimeout(handler);
  }, [searchTerm, category, sortOrder]);


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
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('Search_products')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
        </div>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filters">
                 <AccordionTrigger>
                    <div className='flex items-center gap-2'>
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="text-sm font-medium">Filtros y Opciones de Vista</span>
                    </div>
                 </AccordionTrigger>
                 <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 p-2">
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('Filter_by_category')} />
                            </SelectTrigger>
                            <SelectContent>
                            {initialCategories.map(cat => (
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
      
        <div ref={listRef} className={cn({
            'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8': viewMode === 'grid-lg',
            'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4': viewMode === 'grid-sm',
            'flex flex-col gap-4': viewMode === 'list',
        })}>
          {products.map(product => 
              viewMode === 'list' ? (
                <ProductListItem key={product.id} product={product} onProductClick={handleProductClick} />
              ) : (
                <ProductCard key={product.id} product={product} size={viewMode === 'grid-sm' ? 'sm' : 'lg'} onProductClick={handleProductClick} />
              )
          )}
        </div>
     
        {isLoading && <ProductListSkeleton />}

        <div ref={loadMoreRef} className="h-10" />
        
        {!hasMore && !isLoading && products.length > 0 && (
          <p className="text-center text-muted-foreground text-sm">Fin de los resultados.</p>
        )}

        {!isLoading && products.length === 0 && (
             <p className="text-center text-muted-foreground text-sm p-12">No se encontraron productos.</p>
        )}
    </div>
  );
}
