
"use client";

import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/contexts/language-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import WhatsAppButton from '@/components/layout/whatsapp-button';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/contexts/cart-context';
import type { Metadata } from 'next';

/*
export const metadata: Metadata = {
  metadataBase: new URL('https://www.ajalderaiz.com'),
  title: {
    default: 'Ajal de Raiz - Vivero & Jardinería',
    template: `%s | Ajal de Raiz`,
  },
  description: 'Un toque verde para la vida moderna. Descubre nuestra colección de plantas y suministros de jardinería para dar vida a tu hogar y jardín.',
  openGraph: {
    title: 'Ajal de Raiz - Vivero & Jardinería',
    description: 'Un toque verde para la vida moderna. Plantas, herramientas y todo lo que necesitas para tu jardín.',
    url: 'https://www.ajalderaiz.com',
    siteName: 'Ajal de Raiz',
    images: [
      {
        url: '/images/og-image.jpg', // Ruta relativa a la carpeta `public`
        width: 1200,
        height: 630,
        alt: 'Vivero Ajal de Raiz',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ajal de Raiz - Vivero & Jardinería',
    description: 'Un toque verde para la vida moderna. Plantas, herramientas y todo lo que necesitas para tu jardín.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Ajal de Raiz</title>
        <meta name="description" content="Un toque verde para la vida moderna. Descubre nuestra colección de plantas y suministros de jardinería para dar vida a tu hogar y jardín." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ajalderaiz.com/" />
        <meta property="og:title" content="Ajal de Raiz - Vivero & Jardinería" />
        <meta property="og:description" content="Un toque verde para la vida moderna. Plantas, herramientas y todo lo que necesitas para tu jardín." />
        <meta property="og:image" content="https://res.cloudinary.com/dqh1coa3c/image/upload/v1753971387/Imagen_de_WhatsApp_2025-07-31_a_las_11.12.34_6ed49bfb_hkonqb.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.ajalderaiz.com/" />
        <meta property="twitter:title" content="Ajal de Raiz - Vivero & Jardinería" />
        <meta property="twitter:description" content="Un toque verde para la vida moderna. Plantas, herramientas y todo lo que necesitas para tu jardín." />
        <meta property="twitter:image" content="https://res.cloudinary.com/dqh1coa3c/image/upload/v1753971387/Imagen_de_WhatsApp_2025-07-31_a_las_11.12.34_6ed49bfb_hkonqb.jpg" />
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
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-grow pb-12">{children}</main>
                  <Footer />
                </div>
                <WhatsAppButton />
                <Toaster />
              </CartProvider>
            </LanguageProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
