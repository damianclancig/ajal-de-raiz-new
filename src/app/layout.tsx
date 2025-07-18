
"use client";

import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/contexts/language-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import WhatsAppButton from '@/components/layout/whatsapp-button';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Ajal de Raiz</title>
        <meta name="description" content="A Curated Catalog of Plants and Gardening Supplies" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-grow pb-12">{children}</main>
                <Footer />
              </div>
              <WhatsAppButton />
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
