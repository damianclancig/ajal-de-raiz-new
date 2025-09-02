
'use client';

import Image from "next/image";
import AnimatedContent from "./_components/animated-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      <header className="text-center mb-12">
        <AnimatedContent>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
            {t('About_Title')}
          </h1>
        </AnimatedContent>
        <AnimatedContent>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('About_Subtitle')}
          </p>
        </AnimatedContent>
      </header>

      <div className="space-y-16">

        {/* Section 1: Image Left, Text Right */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="w-full md:w-2/5">
            <AnimatedContent>
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1754482094/ajal-de-raiz/Mini_Jungla_w5d2s8.jpg"
                  alt="Planta de Ajal de Raíz en un entorno natural"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  data-ai-hint="nature plants"
                />
              </div>
            </AnimatedContent>
          </div>
          <div className="w-full md:w-3/5 font-story text-lg md:text-xl text-foreground/80 space-y-4">
            <AnimatedContent>
              <p>
                {t('About_P1')}
              </p>
            </AnimatedContent>
            <AnimatedContent>
              <p>
                {t('About_P2')}
              </p>
            </AnimatedContent>
          </div>
        </div>

        {/* Section 2: Text Left, Image Right */}
        <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center">
          <div className="w-full md:w-2/5">
            <AnimatedContent>
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1754482844/ajal-de-raiz/Varias_Especies_ofsqvv.jpg"
                  alt="Variedad de suculentas y cactus"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  data-ai-hint="succulents cactus"
                />
              </div>
            </AnimatedContent>
          </div>
          <div className="w-full md:w-3/5 font-story text-lg md:text-xl text-foreground/80 space-y-4">
            <AnimatedContent>
              <p>
                {t('About_P3')}
              </p>
            </AnimatedContent>
          </div>
        </div>

        {/* Section 3: Image Left, Text Right */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="w-full md:w-2/5">
            <AnimatedContent>
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1754481734/ajal-de-raiz/Mini_Kokedama_i5zsry.jpg"
                  alt="Mini Kokedama de Ajal de Raíz"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  data-ai-hint="kokedama plant"
                />
              </div>
            </AnimatedContent>
          </div>
          <div className="w-full md:w-3/5 font-story text-lg md:text-xl text-foreground/80 space-y-4">
            <AnimatedContent>
              <p>
                {t('About_P4')}
              </p>
            </AnimatedContent>
            <AnimatedContent>
              <p>
                {t('About_P5')}
              </p>
            </AnimatedContent>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center border-t pt-16">
          <AnimatedContent>
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              {t('About_CTA_Title')}
            </h2>
          </AnimatedContent>
          <AnimatedContent>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              {t('About_CTA_Subtitle')}
            </p>
          </AnimatedContent>
          <AnimatedContent>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/products">
                  {t('About_CTA_Button')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
}
