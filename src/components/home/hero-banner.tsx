

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
  slides: HeroSlide[];
  isAdmin?: boolean;
}

export default function HeroBanner({ slides, isAdmin }: HeroBannerProps) {
  const { t } = useLanguage();

  if (slides.length === 0) {
    // You can render a default or placeholder banner if no slides are available
    return (
      <section className="w-full">
        <div className="relative h-[40vh] md:h-[70vh] w-full">
          {/* Blurred Background Layer */}
          <Image
            src="https://placehold.co/1600x800.png"
            alt="Default banner background"
            fill
            priority
            className="object-cover blur-xl scale-110 brightness-50"
            sizes="100vw"
            aria-hidden="true"
          />
          {/* Main Content Layer */}
          <Image
            src="https://placehold.co/1600x800.png"
            alt="Default banner"
            fill
            priority
            className="object-contain z-10 relative"
            sizes="100vw"
            data-ai-hint="plants greenhouse"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 z-30">
            <div className="bg-black/30 backdrop-blur-sm p-6 md:p-10 rounded-lg">
              <h1 className="font-headline text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white shadow-lg">
                {t('Ajal_de_Raiz')}
              </h1>
              <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
                {t('Discover_curated_collection_plants_gardening_supplies')}
              </p>
              <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/products">{t('Shop_Now')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[40vh] md:h-[70vh] w-full overflow-hidden bg-black/50 group">
                {/* Admin Edit Shortcut */}
                {isAdmin && (
                  <Button
                    asChild
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4 z-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                  >
                    <Link href={`/admin/slides/${slide.id}/edit`}>
                      <Pencil className="w-4 h-4 text-black" />
                      <span className="sr-only">Editar Slide</span>
                    </Link>
                  </Button>
                )}

                {/* Blurred Background Layer */}
                <Image
                  src={slide.image.replace(/\.heic$/i, '.png')}
                  alt={`${slide.headline} background`}
                  fill
                  priority={index === 0}
                  className="object-cover blur-xl scale-110 brightness-[0.4]"
                  sizes="100vw"
                  aria-hidden="true"
                />
                {/* Main Content Layer */}
                <Image
                  src={slide.image.replace(/\.heic$/i, '.png')}
                  alt={slide.headline}
                  fill
                  priority={index === 0}
                  className="object-contain z-10 relative pointer-events-none"
                  sizes="100vw"
                  data-ai-hint={slide.dataAiHint || 'promotional banner'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 z-30">
                  <div className={cn(
                    "p-6 md:p-10 rounded-lg transition-all",
                    slide.headline ? "bg-black/30 backdrop-blur-sm" : ""
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

