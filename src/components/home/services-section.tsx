
"use client"

import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, SprayCan, HandCoins, Sprout } from "lucide-react";
import Image from "next/image";
import { servicesData } from "@/lib/services-data";
import ServiceCard from "./service-card";

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="services" className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">
          Servicios de Ajal de Raíz
        </h2>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">
          Todo lo que necesitás para cuidar tus plantas, energías y rituales. Hecho con amor y raíces.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {servicesData.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
