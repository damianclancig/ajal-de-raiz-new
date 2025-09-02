
"use client"

import { useLanguage } from "@/hooks/use-language";
import ServiceCard from "./service-card";
import { Service } from "@/lib/types";

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const { t } = useLanguage();

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
