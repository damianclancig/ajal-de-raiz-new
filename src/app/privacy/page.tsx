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
    title: 'Política de Privacidad',
    description: 'Conoce cómo tratamos y protegemos tus datos personales en Ajal de Raíz.',
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

export default function PrivacyPolicyPage() {
    return (
        <div className="container max-w-4xl mx-auto py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-4xl text-center">Política de Privacidad</CardTitle>
                    <p className="text-center text-xs text-muted-foreground mt-2">Última actualización: 1/7/2026</p>
                </CardHeader>
                <CardContent className="prose prose-stone dark:prose-invert max-w-none space-y-8">
                    <p className="text-center text-muted-foreground">
                        En <strong>Ajal de Raíz</strong> nos comprometemos a garantizar la protección y confidencialidad de los datos personales de nuestros usuarios y clientes. A continuación, detallamos de qué manera recopilamos, utilizamos y resguardamos tu información.
                    </p>
                    <Separator className="!my-8" />

                    <Section title="1. Información que Recopilamos">
                        <p>Recopilamos la información estrictamente necesaria para ofrecerte una experiencia de compra fluida y segura. Esto incluye:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Datos de Identificación y Contacto:</strong> Nombre, apellido, dirección de correo electrónico, número de teléfono y dirección de entrega.</li>
                            <li><strong>Información de Transacciones:</strong> Detalles de los productos adquiridos, método de pago seleccionado y fecha de la compra.</li>
                            <li><strong>Datos de Navegación:</strong> Dirección IP, tipo de navegador y cookies de sesión necesarias para el correcto funcionamiento del carrito y el inicio de sesión.</li>
                        </ul>
                    </Section>

                    <Section title="2. Uso de la Información">
                        <p>Tus datos personales son utilizados para las siguientes finalidades:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Procesar y gestionar tus pedidos de plantas y accesorios.</li>
                            <li>Coordinar los envíos y entregas a domicilio de forma correcta.</li>
                            <li>Brindarte soporte al cliente, responder consultas y gestionar devoluciones en los casos contemplados.</li>
                            <li>Cumplir con las obligaciones legales y de facturación que apliquen al comercio electrónico.</li>
                            <li>Enviar comunicaciones informativas o promocionales únicamente si has prestado tu consentimiento expreso para ello.</li>
                        </ul>
                    </Section>

                    <Section title="3. Protección y Seguridad de los Datos">
                        <p>Implementamos medidas de seguridad técnicas y organizativas para evitar la pérdida, mal uso, alteración o acceso no autorizado a tus datos personales:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Transacciones Seguras:</strong> No almacenamos ni tenemos acceso a tus datos de tarjetas de crédito o débito. Todo el proceso de pago se realiza de manera segura y encriptada a través de la pasarela de pagos integrada de <strong>MercadoPago</strong>.</li>
                            <li><strong>Acceso Restringido:</strong> Solo el personal autorizado de Ajal de Raíz encargado del procesamiento de pedidos tiene acceso a la base de datos de usuarios.</li>
                        </ul>
                    </Section>

                    <Section title="4. Compartir Información con Terceros">
                        <p>No vendemos, alquilamos ni comercializamos tus datos personales bajo ninguna circunstancia. No obstante, para prestar nuestros servicios de manera eficaz, compartimos información de forma limitada con los siguientes proveedores externos:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Empresas de mensajería y logística:</strong> Para poder enviar y entregar los pedidos en tu domicilio (compartimos únicamente nombre, dirección de entrega y teléfono de contacto).</li>
                            <li><strong>Proveedores de tecnología:</strong> Servicios de hosting, bases de datos (MongoDB) e infraestructura de autenticación que operan bajo rigurosas cláusulas de confidencialidad.</li>
                        </ul>
                    </Section>

                    <Section title="5. Tus Derechos (Derechos ARCO)">
                        <p>Conforme a la Ley N° 25.326 de Protección de Datos Personales de la República Argentina, tienes derecho a acceder, rectificar, actualizar y solicitar la supresión de tus datos de nuestra base de datos. Para ejercer estos derechos, puedes enviarnos una solicitud formal detallando tu caso a través de nuestros canales de contacto.</p>
                    </Section>

                    <Section title="6. Modificaciones a esta Política">
                        <p>Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Cualquier cambio será publicado en esta misma sección, indicando la fecha de la última actualización arriba detallada.</p>
                    </Section>

                    <Section title="7. Contacto">
                        <p>Si tienes alguna pregunta o inquietud respecto a cómo tratamos tus datos personales, puedes escribirnos a:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Email:</strong> <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a></li>
                            <li><strong>Teléfono/WhatsApp:</strong> <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+{whatsappNumber}</a></li>
                            <li><strong>Redes Sociales:</strong> <a href={`https://instagram.com/${instagramUsername}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Instagram</a></li>
                        </ul>
                    </Section>

                    <div className="text-center pt-4 font-semibold text-foreground">
                        <p><strong>Ajal de Raíz</strong> – Creando mini bosques, protegiendo tus datos 🌱</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
