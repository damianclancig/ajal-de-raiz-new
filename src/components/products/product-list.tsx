
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
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

const PRODUCTS_PER_PAGE = 12;

interface ProductListProps {
  products: Product[];
  initialCategories: string[];
  isAdmin?: boolean;
}

type ViewMode = 'grid-lg' | 'grid-sm' | 'list';

export default function ProductList({ products: initialProducts, initialCategories, isAdmin }: ProductListProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [offset, setOffset] = useState(initialProducts.length);
  const [hasMore, setHasMore] = useState(initialProducts.length === PRODUCTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state from URL or use defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort') || 'name_asc');
  const [viewMode, setViewMode] = useState<ViewMode>((searchParams.get('view') as ViewMode) || 'grid-lg');

  const { ref: loadMoreRef, inView } = useInView();

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  const debouncedUpdateUrl = useDebouncedCallback((params) => {
    router.push(`${pathname}?${createQueryString(params)}`, { scroll: false });
  }, 300);

  const handleFilterChange = (type: 'q' | 'category' | 'sort' | 'view', value: string) => {
    switch (type) {
      case 'q':
        setSearchTerm(value);
        debouncedUpdateUrl({ q: value });
        break;
      case 'category':
        setCategory(value);
        router.push(`${pathname}?${createQueryString({ category: value === 'All' ? '' : value })}`, { scroll: false });
        break;
      case 'sort':
        setSortOrder(value);
        router.push(`${pathname}?${createQueryString({ sort: value === 'name_asc' ? '' : value })}`, { scroll: false });
        break;
      case 'view':
        setViewMode(value as ViewMode);
        router.push(`${pathname}?${createQueryString({ view: value === 'grid-lg' ? '' : value })}`, { scroll: false });
        break;
    }
  };


  const loadProducts = useCallback(async (isNewSearch = false) => {
    setIsLoading(true);
    const currentOffset = isNewSearch ? 0 : offset;

    const result = await getPaginatedProducts({
      limit: PRODUCTS_PER_PAGE,
      offset: currentOffset,
      searchTerm: searchParams.get('q') || '',
      category: searchParams.get('category') || 'All',
      sortOrder: searchParams.get('sort') || 'name_asc',
      state: 'activo'
    });

    if (result.success && result.products) {
      if (isNewSearch) {
        setProducts(result.products);
      } else {
        setProducts(prev => {
          const newProducts = result.products!.filter(
            p => !prev.some(prevP => prevP.id === p.id)
          );
          return [...prev, ...newProducts];
        });
      }
      setOffset(currentOffset + result.products.length);
      setHasMore(result.products.length === PRODUCTS_PER_PAGE);
    }
    setIsLoading(false);
  }, [offset, searchParams]);


  // Effect to load more products when the sentinel is in view
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      loadProducts();
    }
  }, [inView, isLoading, hasMore, loadProducts]);


  // Effect to handle new searches when URL params change
  useEffect(() => {
    loadProducts(true);
  }, [searchParams]);


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
            onChange={e => handleFilterChange('q', e.target.value)}
            className="pl-10"
          />
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="filters">
            <AccordionTrigger>
              <div className='flex items-center gap-2'>
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm font-medium">{t('Filters_and_View_Options')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-2">
                <Select value={category} onValueChange={(value) => handleFilterChange('category', value)}>
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
                <Select value={sortOrder} onValueChange={(value) => handleFilterChange('sort', value)}>
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
                  <Button variant={viewMode === 'grid-lg' ? 'secondary' : 'ghost'} size="icon" onClick={() => handleFilterChange('view', 'grid-lg')}>
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                  <Button variant={viewMode === 'grid-sm' ? 'secondary' : 'ghost'} size="icon" onClick={() => handleFilterChange('view', 'grid-sm')}>
                    <Grid3x3 className="h-5 w-5" />
                  </Button>
                  <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => handleFilterChange('view', 'list')}>
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className={cn({
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8': viewMode === 'grid-lg',
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4': viewMode === 'grid-sm',
        'flex flex-col gap-4': viewMode === 'list',
      })}>
        {products.map(product =>
          viewMode === 'list' ? (
            <ProductListItem key={product.id} product={product} />
          ) : (
            <ProductCard key={product.id} product={product} size={viewMode === 'grid-sm' ? 'sm' : 'lg'} isAdmin={isAdmin} />
          )
        )}
      </div>

      {isLoading && products.length > 0 && <ProductListSkeleton />}

      <div ref={loadMoreRef} className="h-1" />

      {!hasMore && !isLoading && products.length > 0 && (
        <p className="text-center text-muted-foreground text-sm p-4">{t('End_of_results')}</p>
      )}

      {isLoading && products.length === 0 && <ProductListSkeleton />}

      {!isLoading && products.length === 0 && (
        <p className="text-center text-muted-foreground text-sm p-12">{t('No_products_found_with_filters')}</p>
      )}
    </div>
  );
}
