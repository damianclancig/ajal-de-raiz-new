
import Image from "next/image";
import { Metadata } from "next";
import AnimatedContent from "./_components/animated-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Ajal de Raíz",
  description: "Ajal de Raíz es más que una tienda de plantas; es un proyecto que florece con amor, raíces profundas y un propósito claro: reconectar con la naturaleza.",
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      <header className="text-center mb-12">
        <AnimatedContent>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
            Nuestra Historia
          </h1>
        </AnimatedContent>
        <AnimatedContent>
          <p className="mt-4 text-lg text-muted-foreground">
            Un proyecto que florece con amor y raíces profundas.
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
                Ajal de Raíz es más que una tienda de plantas; es un proyecto que
                florece con amor, raíces profundas y un propósito claro: reconectar
                con la naturaleza, incluso en los rincones más pequeños.
              </p>
            </AnimatedContent>
            <AnimatedContent>
              <p>
                Nacimos luego de un viaje que nos transformó. Aprendimos que las
                grandes cosas surgen cuando nos reinventamos desde adentro, desde la
                raíz. Así comenzó nuestro jardín, que hoy sigue creciendo con cada
                especie nueva, cada kokedama armada con paciencia, cada suculenta
                elegida con intención.
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
                Nos apasiona ofrecer una selección cuidada de suculentas, cactus,
                terrarios, kokedamas y plantas especiales. Entre nuestras especies
                podés encontrar sedum, echeverias, crassulas, haworthias, kalanchoes,
                sempervivum, cactus y muchas más. Cada una tiene su historia, su
                belleza, su energía única.
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
                Queremos que este espacio sea una invitación a crear tu propio rincón
                verde. No se necesitan hectáreas para tener un jardín: basta con una
                maceta, una mesa, una repisa… o tus propias manos. Creamos piezas
                vivas para que puedas regalarte naturaleza, armonía y calma.
              </p>
            </AnimatedContent>
            <AnimatedContent>
              <p>
                Ajal de Raíz es eso: un pedacito de bosque en tu hogar. Porque todos
                merecemos convivir con lo natural, rodearnos de vida y transformar
                nuestros espacios, por más pequeños que sean, en refugios verdes
                llenos de alma.
              </p>
            </AnimatedContent>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center border-t pt-16">
          <AnimatedContent>
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Explora Nuestra Colección
            </h2>
          </AnimatedContent>
          <AnimatedContent>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Ahora que conoces nuestra historia, te invitamos a descubrir las plantas que la hacen posible. Encuentra la pieza de naturaleza perfecta para tu espacio.
            </p>
          </AnimatedContent>
          <AnimatedContent>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/products">
                  Ver Productos
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
