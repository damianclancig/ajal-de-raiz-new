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


"use client"

import { useLanguage } from "@/hooks/use-language";
import ServiceCard from "./service-card";
import { Service } from "@/lib/types";

interface ServicesSectionProps {
  services: Service[] | null;
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const { t } = useLanguage();

  if (!services) {
    return (
      <section id="services" className="container py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            {t('Ajal_de_Raiz_Services')}
          </h2>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">
            {t('Ajal_de_Raiz_Services_Desc')}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-8 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30 rounded-xl text-center max-w-2xl mx-auto shadow-sm">
          <p className="text-amber-800 dark:text-amber-200 font-medium text-lg">
            {t('Services_Unavailable_Title')}
          </p>
          <p className="text-amber-700/80 dark:text-amber-300/80 text-sm mt-2 max-w-md">
            {t('Services_Unavailable_Desc')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">
          {t('Ajal_de_Raiz_Services')}
        </h2>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">
          {t('Ajal_de_Raiz_Services_Desc')}
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
