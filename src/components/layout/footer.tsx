"use client";

import { useLanguage } from "@/hooks/use-language";
import Logo from "../icons/logo";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container py-2">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-2 mb-2">
                <Logo size={56} />
                <span className="font-headline text-2xl font-bold">
                  {t("Ajal")} <span className="font-light text-muted-foreground">{t("de_Raiz")}</span>
                </span>
            </div>
            <p className="text-muted-foreground">{t('A_green_touch_for_modern_living')}</p>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-headline text-lg font-semibold mb-2">{t('Contact_Us')}</h3>
            <p className="text-muted-foreground mb-3">{t('Have_questions')}</p>
            <form className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder={t('Email')} />
              <Button type="submit">{t('Contact_Us')}</Button>
            </form>
          </div>
        </div>
        <div className="mt-4 border-t pt-4 text-center text-sm text-muted-foreground">
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
