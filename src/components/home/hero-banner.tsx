/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { HeroSlide } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import React from 'react';

// Helper function to parse simple markdown-like formatting
const parseSubtext = (text: string) => {
  if (!text) return '';

  const html = text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>') // Bold for *text*
    .replace(/_(.*?)_/g, '<u>$1</u>')           // Underline for _text_
    .replace(/-(.*?)-/g, '<s>$1</s>');          // Strikethrough for -text-

  return React.createElement('p', {
    className: 'mt-4 max-w-2xl text-lg md:text-xl text-gray-200 whitespace-pre-line',
    dangerouslySetInnerHTML: { __html: html }
  });
};


interface HeroBannerProps {
  slides: HeroSlide[] | null;
  isAdmin?: boolean;
}

export default function HeroBanner({ slides, isAdmin }: HeroBannerProps) {
  const { t } = useLanguage();

  if (!slides || slides.length === 0) {
    // Si no hay slides/novedades, el banner se vuelve transparente (no renderiza nada)
    return null;
  }

  return (
    <section className="w-full">
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className={cn(
                "relative h-[40vh] md:h-[70vh] w-full overflow-hidden group",
                slide.image ? "bg-black/50" : "bg-transparent"
              )}>
                {/* Admin Edit Shortcut */}
                {isAdmin && (
                  <Button
                    asChild
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4 z-50 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 bg-neutral-950/90 border-2 border-primary text-white shadow-[0_0_10px_hsl(var(--primary)/0.5)] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary))] hover:scale-105"
                  >
                    <Link href={`/admin/slides/${slide.id}/edit`}>
                      <Pencil className="w-4 h-4 stroke-2" />
                      <span className="sr-only">Editar Slide</span>
                    </Link>
                  </Button>
                )}

                {/* Blurred Background Layer */}
                {slide.image && (
                  <Image
                    src={slide.image.replace(/\.heic$/i, '.png')}
                    alt={`${slide.headline} background`}
                    fill
                    priority={index === 0}
                    className="object-cover blur-xl scale-110 brightness-[0.4]"
                    sizes="100vw"
                    aria-hidden="true"
                  />
                )}
                {/* Main Content Layer */}
                {slide.image && (
                  <Image
                    src={slide.image.replace(/\.heic$/i, '.png')}
                    alt={slide.headline}
                    fill
                    priority={index === 0}
                    className="object-contain z-10 relative pointer-events-none"
                    sizes="100vw"
                    data-ai-hint={slide.dataAiHint || 'promotional banner'}
                  />
                )}
                {slide.image && <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none" />}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 z-30">
                  <div className={cn(
                    "p-6 md:p-10 rounded-lg transition-all",
                    slide.headline && slide.image ? "bg-black/30 backdrop-blur-sm" : ""
                  )}>
                    {slide.headline && (
                      <h1 className="font-headline text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white shadow-lg">
                        {slide.headline}
                      </h1>
                    )}
                    {parseSubtext(slide.subtext)}
                    <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Link href={slide.buttonLink || '/products'}>{t('Shop_Now')}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 border-white/50 z-40" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 border-white/50 z-40" />
      </Carousel>
    </section>
  );
}

