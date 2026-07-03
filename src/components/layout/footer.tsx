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


"use client";

import { useLanguage } from "@/hooks/use-language";
import Logo from "../icons/logo";
import InstagramIcon from "../icons/instagram-icon";
import WhatsappIcon from "../icons/whatsapp-icon";
import { translations } from "@/lib/translations";
import MailIcon from "../icons/mail-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const { t } = useLanguage();
  const instagramUsername = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'viveroajalderaiz';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491168793296';
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'viveroajalderaiz@gmail.com'

  return (
    <footer id="page-footer" className="border-t bg-card text-card-foreground">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-2">
              <Logo size={56} />
              <span className="font-headline text-2xl font-bold">
                {t("Ajal")} {t("de_Raiz")}
              </span>
            </div>
            <p className="text-muted-foreground">{t('A_green_touch_for_modern_living')}</p>
          </div>

          <div className="flex flex-col items-center md:items-end">
             <h4 className="font-semibold mb-2">{t('Our_Social_Networks')}</h4>
             <TooltipProvider>
                <div className="flex items-center gap-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a 
                                href={`mailto:${contactEmail}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-muted-foreground transition-opacity hover:text-primary"
                                aria-label="Email"
                            >
                                <MailIcon className="h-7 w-7" />
                                <span className="sr-only">Email</span>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Enviar un email a {contactEmail}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <a 
                                href={`https://instagram.com/${instagramUsername}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[#E1306C] transition-opacity hover:opacity-80"
                                aria-label="Instagram"
                            >
                                <InstagramIcon className="h-7 w-7" />
                                <span className="sr-only">Instagram</span>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Visita nuestro Instagram</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a 
                                href={`https://wa.me/${whatsappNumber}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[#25D366] transition-opacity hover:opacity-80"
                                aria-label="WhatsApp"
                            >
                                <WhatsappIcon className="h-7 w-7" />
                                <span className="sr-only">WhatsApp</span>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent>
                             <p>Escríbenos por WhatsApp</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 grid grid-cols-1 md:grid-cols-3 text-center md:text-left gap-8">
            <div className="flex-1">
                <h4 className="font-semibold mb-1">{t('Opening_Hours')}</h4>
                <p className="text-sm text-muted-foreground">{t('Monday_to_Friday')}</p>
                <p className="text-sm text-muted-foreground">{t('Saturdays')}</p>
            </div>
            <div className="flex-1 md:text-center flex flex-col items-center gap-1">
                <h4 className="font-semibold mb-1">{t('Legal')}</h4>
                <Button variant="link" asChild className="p-0 h-auto text-sm text-muted-foreground">
                    <Link href="/terms">{t('Terms_and_Conditions')}</Link>
                </Button>
                <Button variant="link" asChild className="p-0 h-auto text-sm text-muted-foreground">
                    <Link href="/privacy">{t('Privacy_Policy')}</Link>
                </Button>
            </div>
             <div className="flex-1 md:text-right">
                <h4 className="font-semibold mb-1">{t('Location')}</h4>
                <p className="text-sm text-muted-foreground">Bernal, Argentina</p>
            </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Clancig FullstackWeb. Distribuido bajo Licencia Apache 2.0.</p>
          <p className="text-xs mt-2">
            {t('Web_design_and_development_by')}{' '}
            <a
              href="https://clancig.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-primary transition-colors"
            >
              clancig.com.ar
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
