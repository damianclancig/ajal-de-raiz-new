
import ContactSection from "@/components/home/contact-section";
import FeaturedProducts from "@/components/home/featured-products";
import HeroBanner from "@/components/home/hero-banner";
import ServicesSection from "@/components/home/services-section";
import ShippingZonesSection from "@/components/home/shipping-zones-section";
import { getFeaturedProducts } from "@/lib/product-service";
import { getActiveSlides } from "@/lib/slide-service";
import { getAllServices } from "@/lib/service-service";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ajal de Raiz - Vivero & Jardinería Online',
  description: 'Un toque verde para la vida moderna. Descubre nuestra colección curada de plantas de interior, exterior, y todos los suministros de jardinería que necesitas para tu hogar.',
};

export default async function Home() {
  const [featuredProducts, slides, services] = await Promise.all([
    getFeaturedProducts(),
    getActiveSlides(),
    getAllServices()
  ]);
  
  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      <HeroBanner slides={slides} />
      <FeaturedProducts products={featuredProducts} />
      <ServicesSection services={services} />
      <ContactSection />
      <ShippingZonesSection />
    </div>
  );
}
