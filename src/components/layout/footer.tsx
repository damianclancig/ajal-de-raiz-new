
"use client";

import { useLanguage } from "@/hooks/use-language";
import Logo from "../icons/logo";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-2 mb-2">
            <Logo size={56} />
            <span className="font-headline text-2xl font-bold">
              {t("Ajal")} {t("de_Raiz")}
            </span>
          </div>
          <p className="text-muted-foreground">{t('A_green_touch_for_modern_living')}</p>
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
