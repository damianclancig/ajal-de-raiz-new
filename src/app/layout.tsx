

import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/providers/providers';
import { Analytics } from '@vercel/analytics/react';
import { PT_Sans, Belleza, Cormorant_Garamond } from 'next/font/google';

const ptSans = PT_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '700'], 
  style: ['normal', 'italic'],
  variable: '--font-pt-sans',
});

const belleza = Belleza({ 
  subsets: ['latin'], 
  weight: ['400'], 
  variable: '--font-belleza',
});

const cormorantGaramond = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['400', '700'], 
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ajalderaiz.com.ar'),
  title: {
    default: 'Ajal de Raiz - Vivero & Jardinería Online',
    template: `%s | Ajal de Raiz`,
  },
  description: 'Un toque verde para la vida moderna. Descubre nuestra colección curada de plantas de interior, exterior, y todos los suministros de jardinería que necesitas para tu hogar.',
  openGraph: {
    title: 'Ajal de Raiz - Vivero & Jardinería Online',
    description: 'Un toque verde para la vida moderna. Plantas, herramientas y todo lo que necesitas para tu jardín.',
    url: 'https://www.ajalderaiz.com.ar',
    siteName: 'Ajal de Raiz',
    images: [
      {
        url: 'https://res.cloudinary.com/dqh1coa3c/image/upload/v1754482844/ajal-de-raiz/Varias_Especies_ofsqvv.jpg',
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
    title: 'Ajal de Raiz - Vivero & Jardinería Online',
    description: 'Un toque verde para la vida moderna. Plantas, kokedamas y todo lo que necesitas para tu jardín.',
    images: ['https://res.cloudinary.com/dqh1coa3c/image/upload/v1754482844/ajal-de-raiz/Varias_Especies_ofsqvv.jpg'],
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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f1eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1b5030' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-body antialiased ${ptSans.variable} ${belleza.variable} ${cormorantGaramond.variable}`}>
        <Providers>
           {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
