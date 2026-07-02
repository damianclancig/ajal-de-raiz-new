"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Database, AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  const { t } = useLanguage();

  useEffect(() => {
    // Registrar el error en consola de manera controlada para ambientes de desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }, [error]);

  // Intentar detectar si el error está relacionado con fallos de conexión a MongoDB
  const errorMsg = error.message || '';
  const errorStack = error.stack || '';
  const isMongoError = 
    errorMsg.includes('mongodb') || 
    errorMsg.includes('ENOTFOUND') || 
    errorMsg.includes('querySrv') || 
    errorMsg.includes('MongoClient') ||
    errorStack.includes('mongodb') || 
    errorStack.includes('querySrv') ||
    errorStack.includes('MongoClient');

  const isDev = process.env.NODE_ENV === 'development';
  const titleKey = isMongoError 
    ? (isDev ? 'Database_Connection_Error' : 'Database_Connection_Error_Prod') 
    : 'Generic_Error_Title';
  const descKey = isMongoError 
    ? (isDev ? 'Database_Connection_Error_Desc' : 'Database_Connection_Error_Desc_Prod') 
    : 'Generic_Error_Desc';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center bg-background text-foreground transition-colors duration-300">
      <div className="flex flex-col items-center max-w-lg p-8 md:p-12 bg-card border border-border rounded-2xl shadow-lg dark:shadow-neutral-950/50">
        
        {/* Icono animado/premium */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-destructive/10 dark:bg-destructive/20 text-destructive animate-pulse">
          {isMongoError ? (
            <Database className="w-10 h-10 stroke-[1.5]" />
          ) : (
            <AlertTriangle className="w-10 h-10 stroke-[1.5]" />
          )}
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
          </span>
        </div>

        {/* Título de error */}
        <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-4">
          {t(titleKey)}
        </h1>

        {/* Descripción amigable */}
        <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
          {t(descKey)}
        </p>

        {/* Botones de acción (Mínimo 44px de alto para touch targets en móviles) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button
            onClick={() => reset()}
            size="lg"
            className="flex items-center justify-center min-h-[44px] px-6 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all rounded-xl"
          >
            <RefreshCw className="w-4 h-4 mr-2 stroke-[2] transition-transform duration-500 hover:rotate-180" />
            {t('Try_Again')}
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex items-center justify-center min-h-[44px] px-6 font-semibold border-border hover:bg-muted transition-all rounded-xl"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2 stroke-[2]" />
              {t('Go_Back_Home')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
