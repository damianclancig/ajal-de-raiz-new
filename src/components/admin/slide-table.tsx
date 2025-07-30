
"use client";

import React, { useState, useTransition } from 'react';
import type { HeroSlide } from '@/lib/types';
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
import { deleteSlide } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { NO_IMAGE_URL } from '@/lib/utils';

interface SlideTableProps {
  initialSlides: HeroSlide[];
}

export default function SlideTable({ initialSlides }: SlideTableProps) {
  const { t } = useLanguage();
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = async (slideId: string) => {
    startTransition(async () => {
      const result = await deleteSlide(slideId);
      if (result.success) {
        setSlides(slides.filter(s => s.id !== slideId));
        toast({ title: t('Slide_Deleted_Title'), description: t('Slide_Deleted_Desc') });
      } else {
        toast({ title: t('Error_Title'), description: result.message, variant: "destructive" });
      }
    });
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="hidden md:table-header-group">
            <TableRow>
              <TableHead className="w-[80px]">{t('Image')}</TableHead>
              <TableHead>{t('Headline')}</TableHead>
              <TableHead className="hidden md:table-cell max-w-[300px]">{t('Subtext')}</TableHead>
              <TableHead>{t('State')}</TableHead>
              <TableHead className="text-center">{t('Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.map(slide => {
                const imageUrl = slide.image ? slide.image.replace(/\.heic$/i, '.png') : NO_IMAGE_URL;

                return (
                  <TableRow key={slide.id} className="flex flex-col md:table-row p-4 md:p-0 border-b even:bg-muted/25">
                     {/* -- Desktop Cells -- */}
                    <TableCell className="hidden md:table-cell">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
                        <Image 
                          src={imageUrl} 
                          alt={slide.headline}
                          fill
                          className="object-cover"
                          sizes="100px"
                          data-ai-hint={slide.dataAiHint || 'promotional banner'}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-medium">{slide.headline}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate" title={slide.subtext}>{slide.subtext}</TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Badge variant={slide.state === 'habilitado' ? 'default' : 'secondary'}>
                          {t(slide.state as 'habilitado' | 'deshabilitado')}
                        </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      <div className="flex justify-center gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/slides/${slide.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={isPending}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('Are_you_sure')}</AlertDialogTitle>
                              <AlertDialogDescription>{t('This_action_cannot_be_undone')}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(slide.id)} className="bg-destructive hover:bg-destructive/90">{t('Delete')}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>

                    {/* -- Mobile Card -- */}
                    <TableCell className="p-0 md:hidden" colSpan={5}>
                        <div className="flex items-start gap-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-md flex-shrink-0">
                                <Image 
                                    src={imageUrl} 
                                    alt={slide.headline}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                    data-ai-hint={slide.dataAiHint || 'promotional banner'}
                                />
                            </div>
                            <div className="flex-grow pt-1 min-w-0">
                                <div className="font-medium whitespace-normal break-words">{slide.headline}</div>
                                <div className="text-xs text-muted-foreground whitespace-normal break-words">{slide.subtext}</div>
                                <div className="mt-2">
                                     <Badge variant={slide.state === 'habilitado' ? 'default' : 'secondary'}>
                                        {t(slide.state as 'habilitado' | 'deshabilitado')}
                                    </Badge>
                                </div>
                            </div>
                             <div className="flex flex-col flex-shrink-0">
                                <Button asChild variant="ghost" size="icon">
                                    <Link href={`/admin/slides/${slide.id}/edit`}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={isPending}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{t('Are_you_sure')}</AlertDialogTitle>
                                            <AlertDialogDescription>{t('This_action_cannot_be_undone')}</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(slide.id)} className="bg-destructive hover:bg-destructive/90">{t('Delete')}</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
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
