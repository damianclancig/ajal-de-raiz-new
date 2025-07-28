
"use client";

import { useLanguage } from "@/hooks/use-language";
import Logo from "../icons/logo";
import InstagramIcon from "../icons/instagram-icon";
import WhatsappIcon from "../icons/whatsapp-icon";
import { translations } from "@/lib/translations";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const instagramUsername = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'viveroajalderaiz';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491168793296';

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
             <div className="flex items-center gap-4">
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
             </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Ajal de Raiz. {t('All_rights_reserved')}</p>
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
