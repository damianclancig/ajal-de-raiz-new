
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "../ui/badge";
import { Truck } from "lucide-react";
import { zones } from "@/lib/shipping-zones";


export default function ShippingZonesSection() {
  return (
    <section id="shipping-zones" className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">
          Zonas y Costos de Envío
        </h2>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">
          Enviamos vida a cada rincón. Consulta nuestras zonas de cobertura y tarifas.
        </p>
      </div>

       <div className="max-w-4xl mx-auto">
         <Accordion type="single" collapsible className="w-full">
             {zones.map((zone) => (
                <AccordionItem key={zone.zona} value={`item-${zone.zona}`}>
                    <AccordionTrigger className="text-lg hover:no-underline">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                                <Truck className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold">{zone.nombre}</h3>
                                {zone.priceDetails && (
                                  <p className="text-sm text-primary font-bold" dangerouslySetInnerHTML={{ __html: zone.priceDetails[0].replace(/(\$[0-9,.]+)/g, '<strong>$1</strong>') }} />
                                )}
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pl-4 border-l-2 border-primary ml-7 space-y-4 py-4">
                           <div>
                             <h4 className="font-semibold mb-2">Cobertura:</h4>
                             <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                {zone.cobertura.map((area, i) => <li key={i}>{area}</li>)}
                             </ul>
                           </div>
                           <div>
                             <h4 className="font-semibold mb-2">Precios y Condiciones:</h4>
                             <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                 {zone.priceDetails.map((detail, i) => (
                                     <li key={i} dangerouslySetInnerHTML={{ __html: detail.replace(/GRATIS/g, '<strong>GRATIS</strong>').replace(/(\$[0-9,.]+)/g, '<strong>$1</strong>') }} />
                                 ))}
                             </ul>
                           </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
             ))}
         </Accordion>
       </div>
    </section>
  );
}
