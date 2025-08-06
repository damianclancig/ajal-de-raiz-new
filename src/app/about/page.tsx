
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Ajal de Raíz",
  description: "Ajal de Raíz es más que una tienda de plantas; es un proyecto que florece con amor, raíces profundas y un propósito claro: reconectar con la naturaleza.",
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
          Nuestra Historia
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Un proyecto que florece con amor y raíces profundas.
        </p>
      </header>

      <div className="space-y-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1754482094/ajal-de-raiz/Mini_Jungla_w5d2s8.jpg"
              alt="Planta de Ajal de Raíz en un entorno natural"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint="nature plants"
            />
          </div>
          <div className="font-headline text-lg md:text-xl text-foreground/80 space-y-4">
            <p>
              Ajal de Raíz es más que una tienda de plantas; es un proyecto que
              florece con amor, raíces profundas y un propósito claro: reconectar
              con la naturaleza, incluso en los rincones más pequeños.
            </p>
            <p>
              Nacimos luego de un viaje que nos transformó. Aprendimos que las
              grandes cosas surgen cuando nos reinventamos desde adentro, desde la
              raíz. Así comenzó nuestro jardín, que hoy sigue creciendo con cada
              especie nueva, cada kokedama armada con paciencia, cada suculenta
              elegida con intención.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
           <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg md:order-2">
            <Image
              src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1754482844/ajal-de-raiz/Varias_Especies_ofsqvv.jpg"
              alt="Variedad de suculentas y cactus"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint="succulents cactus"
            />
          </div>
          <div className="font-headline text-lg md:text-xl text-foreground/80 space-y-4 md:order-1">
            <p>
              Nos apasiona ofrecer una selección cuidada de suculentas, cactus,
              terrarios, kokedamas y plantas especiales. Entre nuestras especies
              podés encontrar sedum, echeverias, crassulas, haworthias, kalanchoes,
              sempervivum, cactus y muchas más. Cada una tiene su historia, su
              belleza, su energía única.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
           <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1754481734/ajal-de-raiz/Mini_Kokedama_i5zsry.jpg"
              alt="Mini Kokedama de Ajal de Raíz"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint="kokedama plant"
            />
          </div>
          <div className="font-headline text-lg md:text-xl text-foreground/80 space-y-4">
            <p>
              Queremos que este espacio sea una invitación a crear tu propio rincón
              verde. No se necesitan hectáreas para tener un jardín: basta con una
              maceta, una mesa, una repisa… o tus propias manos. Creamos piezas
              vivas para que puedas regalarte naturaleza, armonía y calma.
            </p>
             <p>
              Ajal de Raíz es eso: un pedacito de bosque en tu hogar. Porque todos
              merecemos convivir con lo natural, rodearnos de vida y transformar
              nuestros espacios, por más pequeños que sean, en refugios verdes
              llenos de alma.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
