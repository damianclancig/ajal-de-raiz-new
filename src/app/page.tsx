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

import ContactSection from "@/components/home/contact-section";
import FeaturedProducts from "@/components/home/featured-products";
import HeroBanner from "@/components/home/hero-banner";
import ServicesSection from "@/components/home/services-section";
import { getFeaturedProducts } from "@/lib/product-service";
import { getActiveSlides } from "@/lib/slide-service";
import { getAllServices } from "@/lib/service-service";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ajal de Raiz - Vivero & Jardinería Online',
  description: 'Un toque verde para la vida moderna. Descubre nuestra colección curada de plantas de interior, exterior, y todos los suministros de jardinería que necesitas para tu hogar.',
};

import { auth } from "@/auth";

export default async function Home() {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.error("Error al obtener sesión de auth:", error);
  }

  const [featuredProducts, slides, services] = await Promise.all([
    getFeaturedProducts().catch((err) => {
      console.error("Error al cargar productos destacados en Home:", err);
      return null;
    }),
    getActiveSlides().catch((err) => {
      console.error("Error al cargar novedades en Home:", err);
      return null;
    }),
    getAllServices().catch((err) => {
      console.error("Error al cargar servicios en Home:", err);
      return null;
    })
  ]);

  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      <HeroBanner slides={slides} isAdmin={session?.user?.isAdmin} />
      <FeaturedProducts products={featuredProducts} isAdmin={session?.user?.isAdmin} />
      <ServicesSection services={services} />
      <ContactSection />
    </div>
  );
}
