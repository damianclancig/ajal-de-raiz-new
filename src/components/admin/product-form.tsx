
"use client";

import React, { useTransition, useState } from 'react';
import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import MultiMediaUploader from './image-uploader';
import { createProduct, updateProduct, physicallyDeleteProduct } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '@/components/ui/separator';
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
import Link from 'next/link';

interface ProductFormProps {
  product?: Product | null;
}

export default function ProductForm({ product }: ProductFormProps) {
  const { t, language } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();
  
  const initialPrice = product?.price ?? 0;
  const [rawPrice, setRawPrice] = useState(Math.round(initialPrice * 100).toString());
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const getLocale = () => {
    switch (language) {
      case 'en': return 'en-US';
      case 'pt': return 'pt-BR';
      case 'es':
      default:
        return 'es-AR';
    }
  };

  const formatPrice = (value: string) => {
    const locale = getLocale();
    const numericValue = parseFloat(value) / 100;

    if (isNaN(numericValue)) {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
      }).format(0);
    }
    
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^\d]/g, '');
    setRawPrice(digits || "0");
  };

  const handlePriceClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const length = input.value.length;
    input.setSelectionRange(length, length);
  };

  const handleSubmit = (formData: FormData) => {
    const numericPrice = parseFloat(rawPrice) / 100;
    formData.set('price', numericPrice.toString());
    
    startTransition(async () => {
      const action = product 
        ? updateProduct.bind(null, product.id)
        : createProduct;
        
      const result = await action(formData);

      if (result?.success === false) {
        toast({ title: t('Error_Title'), description: result.message, variant: "destructive" });
      } else {
         toast({ 
          title: product ? t('Product_Updated_Title') : t('Product_Created_Title'), 
          description: t('Product_Saved_Desc') 
        });
      }
    });
  };

  const handleDelete = () => {
    if (!product) return;
    
    startDeleteTransition(async () => {
      const result = await physicallyDeleteProduct(product.id);
      if (result.success) {
        toast({
          title: t('Product_Deleted_Permanently_Title'),
          description: t('Product_Deleted_Permanently_Desc'),
        });
      } else {
        toast({
          title: t('Error_Title'),
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  }
  
  return (
    <div className="space-y-6">
      <form action={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{product ? t('Update_Product') : t('Create_Product')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                 <div>
                    <Label htmlFor="name">{t('Product_Name')}</Label>
                    <Input id="name" name="name" defaultValue={product?.name || ''} required />
                  </div>
                  <div>
                    <Label htmlFor="description">{t('Product_Description')}</Label>
                    <Textarea id="description" name="description" defaultValue={product?.description || ''} />
                  </div>
              </div>
              <div className="space-y-4">
                  <Label htmlFor="images">Imágenes y Videos</Label>
                  <MultiMediaUploader name="images" defaultValues={product?.images || []} />
              </div>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="category">{t('Category')}</Label>
                <Input id="category" name="category" defaultValue={product?.category || ''} />
              </div>
              <div>
                <Label htmlFor="brand">{t('Brand')}</Label>
                <Input id="brand" name="brand" defaultValue={product?.brand || ''} />
              </div>
              <div>
                <Label htmlFor="price">{t('Price')}</Label>
                <Input
                  id="formattedPrice"
                  value={formatPrice(rawPrice)}
                  onChange={handlePriceChange}
                  onClick={handlePriceClick}
                  inputMode="numeric"
                  className="text-right"
                />
                 <input type="hidden" name="price" value={parseFloat(rawPrice) / 100} />
              </div>
               <div>
                  <Label htmlFor="countInStock">{t('Stock')}</Label>
                  <Input id="countInStock" name="countInStock" type="number" defaultValue={product?.countInStock || 0} />
                </div>
               <div>
                <Label htmlFor="state">{t('State')}</Label>
                <Select name="state" defaultValue={product?.state || 'activo'}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select_a_state')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">{t('activo')}</SelectItem>
                    <SelectItem value="inactivo">{t('inactivo')}</SelectItem>
                    <SelectItem value="vendido">{t('vendido')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Label htmlFor="isFeatured" className="">{t('Featured')}</Label>
              <Switch id="isFeatured" name="isFeatured" defaultChecked={product?.isFeatured || false} />
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
              <Button asChild variant="secondary" disabled={isPending}>
                <Link href="/admin/products">{t('Cancel')}</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : t('Save')}
              </Button>
          </CardFooter>
        </Card>
      </form>

      {product && (
        <div className="space-y-4">
           <div className="relative">
              <Separator />
              <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2">
                  <span className="text-sm font-medium text-destructive">{t('Danger_Zone')}</span>
              </div>
           </div>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">{t('Delete_Product_Permanently')}</CardTitle>
              <CardDescription>{t('Delete_Permanently_Warning')}</CardDescription>
            </CardHeader>
            <CardFooter>
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    {t('Delete_Product_Permanently')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="text-destructive" />
                      {t('Are_you_sure')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                       {t('This_action_cannot_be_undone_permanently')}
                       <br />
                       {t('Type_DELETE_to_confirm', { word: 'ELIMINAR' })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input 
                    id="delete-confirm"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="ELIMINAR"
                    autoFocus
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleteConfirmation !== 'ELIMINAR' || isDeleting}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('Delete_Permanently')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
