"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { HeroSlide } from '@/lib/types';

interface HeroBannerProps {
  slides: HeroSlide[];
}

export default function HeroBanner({ slides }: HeroBannerProps) {
  const { t } = useLanguage();

  if (slides.length === 0) {
    // You can render a default or placeholder banner if no slides are available
    return (
       <section className="w-full">
         <div className="relative h-[60vh] md:h-[70vh] w-full">
            <Image
              src="https://placehold.co/1600x800.png"
              alt="Default banner"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              data-ai-hint="plants greenhouse"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <div className="bg-black/30 backdrop-blur-sm p-6 md:p-10 rounded-lg">
                <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white shadow-lg">
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
              <div className="relative h-[60vh] md:h-[70vh] w-full">
                <Image
                  src={slide.image.replace(/\.heic$/i, '.png')}
                  alt={slide.headline}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                  data-ai-hint={slide.dataAiHint || 'promotional banner'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                  <div className="bg-black/30 backdrop-blur-sm p-6 md:p-10 rounded-lg">
                    <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white shadow-lg">
                      {slide.headline}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
                      {slide.subtext}
                    </p>
                    <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Link href="/products">{t('Shop_Now')}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 border-white/50" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 border-white/50" />
      </Carousel>
    </section>
  );
}
