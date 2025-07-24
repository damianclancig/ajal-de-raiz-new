
"use client";

import React, { useTransition } from 'react';
import type { Product } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from './image-uploader';
import { createProduct, updateProduct } from '@/lib/actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';

interface ProductFormProps {
  product?: Product | null;
}

export default function ProductForm({ product }: ProductFormProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (formData: FormData) => {
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
  
  return (
    <form action={handleSubmit}>
      <Card className="overflow-hidden">
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
                <Label htmlFor="image">{t('Image')}</Label>
                <ImageUploader name="image" defaultValue={product?.image || ''} />
            </div>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price || 0} required />
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
              <Link href="/admin">{t('Cancel')}</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : t('Save')}
            </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
