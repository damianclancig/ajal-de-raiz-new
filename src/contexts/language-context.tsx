
"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { translations } from '@/lib/translations';

type Language = 'en' | 'es' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Language;
    if (['en', 'es', 'pt'].includes(browserLang)) {
      setLanguage(browserLang);
    }
  }, []);

  const t = (key: keyof typeof translations): string => {
    // This logic ensures that server-render and initial client-render match.
    // The language will switch on the client after mounting, avoiding hydration mismatch.
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
