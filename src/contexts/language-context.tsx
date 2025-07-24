
"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { translations } from '@/lib/translations';

type Language = 'en' | 'es' | 'pt';
type TranslationKey = keyof typeof translations;
type Replacements = { [key: string]: string | number };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: Replacements) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    // Set language based on browser preference only on client-side
    const browserLang = navigator.language.split('-')[0] as Language;
    if (['en', 'es', 'pt'].includes(browserLang)) {
      setLanguage(browserLang);
    }
  }, []);
  
  const t = (key: TranslationKey, replacements?: Replacements): string => {
    let translation = translations[key]?.[language] || key;
    
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            const regex = new RegExp(`{${placeholder}}`, 'g');
            translation = translation.replace(regex, String(replacements[placeholder]));
        });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
