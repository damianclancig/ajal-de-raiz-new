
"use client";

import React, { useTransition } from 'react';
import type { HeroSlide } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createSlide, updateSlide } from '@/lib/actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import SingleImageUploader from './single-image-uploader';

interface SlideFormProps {
  slide?: HeroSlide | null;
}

export default function SlideForm({ slide }: SlideFormProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const action = slide 
        ? updateSlide.bind(null, slide.id)
        : createSlide;
        
      const result = await action(formData);

      if (result?.success === false) {
        toast({ title: t('Error_Title'), description: result.message, variant: "destructive" });
      } else {
         toast({ 
          title: slide ? t('Slide_Updated_Title') : t('Slide_Created_Title'), 
          description: t('Slide_Saved_Desc') 
        });
      }
    });
  };
  
  return (
    <form action={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{slide ? t('Update_Slide') : t('Create_Slide')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="headline">{t('Headline')}</Label>
              <Input id="headline" name="headline" defaultValue={slide?.headline || ''} required />
            </div>
            <div>
              <Label htmlFor="subtext">{t('Subtext')}</Label>
              <Textarea id="subtext" name="subtext" defaultValue={slide?.subtext || ''} />
            </div>
            <div>
              <Label htmlFor="state">{t('State')}</Label>
              <Select name="state" defaultValue={slide?.state || 'habilitado'}>
                <SelectTrigger>
                  <SelectValue placeholder={t('Select_a_state')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="habilitado">{t('habilitado')}</SelectItem>
                  <SelectItem value="deshabilitado">{t('deshabilitado')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">{t('Image')}</Label>
            <div className="max-w-sm mx-auto">
              <SingleImageUploader name="image" defaultValue={slide?.image} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button asChild variant="secondary" disabled={isPending}>
              <Link href="/admin/slides">{t('Cancel')}</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : t('Save')}
            </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
