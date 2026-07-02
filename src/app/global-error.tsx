'use client';

import { useEffect, useState } from 'react';
import { translations } from '@/lib/translations';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

type Lang = 'es' | 'en' | 'pt';

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [lang, setLang] = useState<Lang>('es');

  useEffect(() => {
    // Registrar el error en consola de manera controlada para ambientes de desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Detectar el idioma del navegador para internacionalizar sin usar contexts
    const browserLang = navigator.language.split('-')[0] as Lang;
    if (['en', 'es', 'pt'].includes(browserLang)) {
      setLang(browserLang);
    }
  }, []);

  const t = (key: keyof typeof translations) => {
    return translations[key]?.[lang] || translations[key]?.['es'] || String(key);
  };

  return (
    <html lang={lang}>
      <body className="font-sans antialiased min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 text-center shadow-2xl">
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 text-destructive mb-6 relative">
            <AlertTriangle className="w-8 h-8 stroke-[1.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-white font-headline">
            {t('Generic_Error_Title')}
          </h1>

          <p className="text-muted-foreground text-sm md:text-base mb-8 leading-relaxed">
            {t('Generic_Error_Desc')}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center min-h-[48px] px-6 font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all rounded-xl shadow-lg shadow-destructive/20 active:scale-95 duration-150"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('Try_Again')}
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
