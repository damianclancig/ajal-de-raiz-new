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


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Términos y Condiciones',
    description: 'Lee nuestros términos y condiciones antes de utilizar nuestro sitio y realizar compras en Ajal de Raiz.',
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'viveroajalderaiz@gmail.com';
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491168793296';
const instagramUsername = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'viveroajalderaiz';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
        <h2 className="font-headline text-2xl font-semibold text-primary">{title}</h2>
        <div className="space-y-2 text-muted-foreground">{children}</div>
        <Separator className="mt-6 !mb-8" />
    </div>
);

export default function TermsAndConditionsPage() {
    return (
        <div className="container max-w-4xl mx-auto py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-4xl text-center">Términos y Condiciones</CardTitle>
                    <p className="text-center text-xs text-muted-foreground mt-2">Última actualización: 1/7/2026</p>
                </CardHeader>
                <CardContent className="prose prose-stone dark:prose-invert max-w-none space-y-8">
                    <p className="text-center text-muted-foreground">
                        Bienvenido/a a <strong>Ajal de Raíz</strong>. Al acceder y utilizar nuestro sitio web, usted acepta y se compromete a cumplir los siguientes términos y condiciones. Le solicitamos que los lea detenidamente antes de realizar cualquier compra.
                    </p>
                    <Separator className="!my-8" />

                    <Section title="1. Información General">
                        <p>Ajal de Raíz es una tienda online dedicada a la venta de plantas suculentas, cactus y otras especies vegetales, así como accesorios relacionados. Todos nuestros productos son preparados con especial cuidado y dedicación para garantizar su calidad.</p>
                    </Section>

                    <Section title="2. Métodos de Pago">
                        <p>Aceptamos los siguientes medios de pago:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Efectivo</strong> (solo en puntos acordados previamente).</li>
                            <li><strong>Transferencia bancaria</strong> (se enviarán los datos al momento de la compra).</li>
                            <li><strong>MercadoPago</strong> (tarjetas de crédito, débito, y otros medios habilitados por la plataforma).</li>
                        </ul>
                        <p>Los pagos deberán ser realizados dentro de las 48 horas posteriores a la confirmación del pedido. En caso de no recibir el pago en ese plazo, el pedido podrá ser cancelado automáticamente.</p>
                    </Section>

                    <Section title="3. Envíos">
                         <ul className="list-disc pl-5 space-y-1">
                            <li>Realizamos <strong>envíos a domicilio</strong> a través de correo y servicios de mensajería.</li>
                            <li>Los costos y tiempos de entrega dependen de la ubicación del comprador y serán informados antes de concretar la compra.</li>
                            <li>Una vez despachado el pedido, el tiempo de entrega depende exclusivamente del servicio de mensajería o correo utilizado.</li>
                            <li>No nos responsabilizamos por demoras ocasionadas por terceros, aunque brindaremos asistencia para el seguimiento del envío.</li>
                        </ul>
                    </Section>

                    <Section title="4. Condiciones de los Productos">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Las plantas son <strong>seres vivos</strong> y pueden presentar ligeras variaciones en color, tamaño o forma respecto a las fotografías publicadas.</li>
                            <li>Las imágenes de los productos son <strong>propias de Ajal de Raíz</strong> y tienen fines ilustrativos.</li>
                            <li>Recomendamos leer atentamente las <strong>indicaciones de cuidado</strong> incluidas con cada producto para garantizar su correcto mantenimiento.</li>
                        </ul>
                    </Section>

                    <Section title="5. Propiedad Intelectual">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Todo el contenido visual, comercial y editorial publicado en este sitio web (imágenes de plantas, descripciones de productos, logotipos, textos y diseños de interfaz) es <strong>propiedad exclusiva de Ajal de Raíz</strong>.</li>
                            <li>El software y código fuente que opera esta plataforma se distribuye públicamente bajo los términos de la <strong>Licencia Apache 2.0</strong>. Esta licencia aplica exclusivamente al código del software y no otorga derechos sobre las marcas comerciales de Ajal de Raíz ni sobre los datos de los usuarios.</li>
                            <li>Queda prohibida la reproducción, distribución o uso comercial del contenido editorial o visual del sitio sin autorización previa y por escrito.</li>
                        </ul>
                    </Section>

                    <Section title="6. Cambios y Devoluciones">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Debido a la naturaleza de nuestros productos (plantas vivas), <strong>no aceptamos devoluciones</strong>.</li>
                            <li>Solo se contemplarán reclamos en caso de recibir un producto dañado durante el transporte, notificando dentro de las <strong>24 horas</strong> posteriores a la entrega y enviando fotografías como respaldo.</li>
                            <li>No nos responsabilizamos por el mal cuidado de las plantas posterior a la entrega.</li>
                        </ul>
                    </Section>

                    <Section title="7. Privacidad de Datos">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Respetamos y protegemos la privacidad de nuestros clientes.</li>
                            <li>Los datos personales solicitados serán utilizados únicamente para procesar pedidos, coordinar entregas y, si el cliente lo autoriza, enviar información comercial.</li>
                            <li>No compartimos ni vendemos información personal a terceros.</li>
                        </ul>
                    </Section>

                    <Section title="8. Modificaciones a los Términos">
                        <p>Ajal de Raíz se reserva el derecho de modificar estos términos y condiciones en cualquier momento, sin previo aviso. Las modificaciones entrarán en vigencia desde su publicación en el sitio web.</p>
                    </Section>

                    <Section title="9. Contacto">
                        <p>Para consultas, reclamos o solicitudes especiales, puede comunicarse con nosotros a través de:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Email:</strong> <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a></li>
                            <li><strong>Teléfono/WhatsApp:</strong> <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+{whatsappNumber}</a></li>
                            <li><strong>Redes Sociales:</strong> <a href={`https://instagram.com/${instagramUsername}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Instagram</a></li>
                        </ul>
                    </Section>

                    <div className="text-center pt-4 font-semibold text-foreground">
                        <p><strong>Ajal de Raíz</strong> – Creando mini bosques, un rincón verde a la vez 🌱</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
