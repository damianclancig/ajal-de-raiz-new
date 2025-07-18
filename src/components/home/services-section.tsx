"use client"

import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, SprayCan } from "lucide-react";
import Image from "next/image";

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="services" className="container py-12 md:py-20 bg-secondary/50 rounded-lg">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">
          {t('Our_Services')}
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          {t('Expert_care_for_your_green_space')}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
           <Image src="https://placehold.co/800x600.png" alt="Gardening services" layout="fill" objectFit="cover" data-ai-hint="gardening tools" />
        </div>
        <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <SprayCan className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">{t('Plant_Maintenance')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('We_offer_regular_maintenance_services')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                    <Leaf className="h-6 w-6 text-primary" />
                 </div>
                <CardTitle className="font-headline text-2xl">{t('Garden_Setup')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('Dreaming_of_a_new_garden')}
                </p>
              </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
