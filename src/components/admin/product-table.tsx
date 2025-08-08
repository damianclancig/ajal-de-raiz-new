
"use client";

import React, { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { deleteProduct, getPaginatedProducts } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NO_IMAGE_URL } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

const PRODUCTS_PER_PAGE = 20;

interface ProductTableProps {
  initialProducts: Product[];
  searchTerm: string;
}

export default function ProductTable({ initialProducts, searchTerm }: ProductTableProps) {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [offset, setOffset] = useState(initialProducts.length);
  const [hasMore, setHasMore] = useState(initialProducts.length === PRODUCTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  const { ref: loadMoreRef, inView } = useInView();

  const loadMoreProducts = useCallback(async () => {
    setIsLoading(true);
    const result = await getPaginatedProducts({ 
      offset, 
      limit: PRODUCTS_PER_PAGE, 
      searchTerm 
    });
    
    if (result.success && result.products) {
      setProducts(prev => [...prev, ...result.products!]);
      setOffset(prev => prev + result.products!.length);
      setHasMore(result.products!.length === PRODUCTS_PER_PAGE);
    }
    setIsLoading(false);
  }, [offset, searchTerm]);

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      loadMoreProducts();
    }
  }, [inView, isLoading, hasMore, loadMoreProducts]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setOffset(0);
      const result = await getPaginatedProducts({
        offset: 0,
        limit: PRODUCTS_PER_PAGE,
        searchTerm,
      });
      if (result.success && result.products) {
        setProducts(result.products);
        setOffset(result.products.length);
        setHasMore(result.products.length === PRODUCTS_PER_PAGE);
      }
      setIsLoading(false);
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (productId: string) => {
    startDeleteTransition(async () => {
      const result = await deleteProduct(productId);
      if (result.success && result.product) {
        setProducts(products.map(p => p.id === productId ? result.product! : p));
        toast({ title: t('Product_Deactivated_Title'), description: t('Product_Deactivated_Desc') });
      } else {
        toast({ title: t('Error_Title'), description: result.message, variant: "destructive" });
      }
    });
  };

  const formatPrice = (price: number) => {
    const locale = language === 'es' ? 'es-AR' : language;
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="hidden md:table-header-group">
            <TableRow>
              <TableHead className="w-[80px]">{t('Image')}</TableHead>
              <TableHead>{t('Product_Name')}</TableHead>
              <TableHead>{t('Category')}</TableHead>
              <TableHead className="text-center">{t('Stock')}</TableHead>
              <TableHead className="text-center">{t('Featured')}</TableHead>
              <TableHead>{t('State')}</TableHead>
              <TableHead className="text-right">{t('Price')}</TableHead>
              <TableHead className="text-center">{t('Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => {
                const imageUrl = (product.images[0] || NO_IMAGE_URL).replace(/\.(mp4|webm)$/i, '.jpg');

                return (
                  <TableRow key={product.id} className="flex flex-col md:table-row p-4 md:p-0 border-b even:bg-muted/25">
                    {/* -- Desktop Cells -- */}
                    <TableCell className="hidden md:table-cell">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                        <Image 
                          src={imageUrl} 
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="100px"
                          data-ai-hint={product.dataAiHint || 'product image'}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-medium">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                    <TableCell className="hidden md:table-cell text-center">{product.countInStock}</TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                        {product.isFeatured ? 
                          <CheckCircle className="h-5 w-5 text-primary mx-auto" /> : 
                          <XCircle className="h-5 w-5 text-muted-foreground mx-auto" /> 
                        }
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Badge variant={product.state === 'activo' ? 'default' : 'destructive'}>
                          {t(product.state as 'activo' | 'inactivo' | 'vendido')}
                        </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">${formatPrice(product.price)}</TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      <div className="flex justify-center gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={product.state === 'inactivo' || isDeleting}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('Are_you_sure')}</AlertDialogTitle>
                              <AlertDialogDescription>{t('This_action_cannot_be_undone_inactive')}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive hover:bg-destructive/90">{t('Deactivate')}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                    
                    {/* -- Mobile Card -- */}
                    <TableCell className="p-0 md:hidden" colSpan={8}>
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex items-start gap-4">
                                <div className="relative h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                                    <Image 
                                        src={imageUrl} 
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                        data-ai-hint={product.dataAiHint || 'product image'}
                                    />
                                </div>
                                <div className="font-medium pt-1">
                                    <div>{product.name}</div>
                                    <div className="text-xs text-muted-foreground">{product.category}</div>
                                </div>
                            </div>
                            <div className="flex flex-shrink-0">
                                <Button asChild variant="ghost" size="icon">
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={product.state === 'inactivo' || isDeleting}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{t('Are_you_sure')}</AlertDialogTitle>
                                            <AlertDialogDescription>{t('This_action_cannot_be_undone_inactive')}</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive hover:bg-destructive/90">{t('Deactivate')}</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm mt-4 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-xs text-muted-foreground mb-1">Stock / Dest.</div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">{product.countInStock} / </span>
                                    {product.isFeatured ? 
                                      <CheckCircle className="h-4 w-4 text-primary" /> : 
                                      <XCircle className="h-4 w-4 text-muted-foreground" /> 
                                    }
                                </div>
                            </div>
                             <div className="flex flex-col items-center justify-center">
                                <div className="text-xs text-muted-foreground mb-1">Estado</div>
                                <Badge variant={product.state === 'activo' ? 'default' : 'destructive'}>
                                    {t(product.state as 'activo' | 'inactivo' | 'vendido')}
                                </Badge>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-xs text-muted-foreground mb-1">Precio</div>
                                <span className="font-bold">${formatPrice(product.price)}</span>
                            </div>
                        </div>
                    </TableCell>

                  </TableRow>
                )
            })}
          </TableBody>
        </Table>

        {isLoading && (
            <div className="flex justify-center items-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )}

        {!isLoading && hasMore && <div ref={loadMoreRef} className="h-10" />}

        {!hasMore && !isLoading && products.length > 0 && (
          <p className="text-center text-muted-foreground text-sm p-4">Fin de los resultados.</p>
        )}

        {!isLoading && products.length === 0 && (
             <p className="text-center text-muted-foreground text-sm p-12">No se encontraron productos.</p>
        )}

      </CardContent>
    </Card>
  );
}
