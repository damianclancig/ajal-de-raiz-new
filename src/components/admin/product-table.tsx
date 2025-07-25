
"use client";

import React, { useState, useTransition } from 'react';
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
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { deleteProduct } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import Link from 'next/link';

interface ProductTableProps {
  initialProducts: Product[];
}

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = async (productId: string) => {
    startTransition(async () => {
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
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{t('Image')}</TableHead>
              <TableHead>{t('Product_Name')}</TableHead>
              <TableHead>{t('Category')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('Stock')}</TableHead>
              <TableHead>{t('Featured')}</TableHead>
              <TableHead>{t('State')}</TableHead>
              <TableHead className="text-right">{t('Price')}</TableHead>
              <TableHead className="text-center">{t('Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => {
                const imageUrl = product.images[0].replace(/\.heic$/i, '.png');

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
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
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.countInStock}</TableCell>
                    <TableCell>{product.isFeatured ? t('Yes') : t('No')}</TableCell>
                    <TableCell>
                        <Badge variant={product.state === 'activo' ? 'default' : product.state === 'inactivo' ? 'secondary' : 'destructive'}>
                          {t(product.state as 'activo' | 'inactivo' | 'vendido')}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">${formatPrice(product.price)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={product.state === 'inactivo' || isPending}>
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
                  </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
