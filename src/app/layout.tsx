import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers/providers';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ajalderaiz.com.ar'),
  title: {
    default: 'Ajal de Raiz - Vivero & Jardinería',
    template: `%s | Ajal de Raiz`,
  },
  description: 'Un toque verde para la vida moderna. Descubre nuestra colección de plantas y suministros de jardinería para dar vida a tu hogar y jardín.',
  openGraph: {
    title: 'Ajal de Raiz - Vivero & Jardinería',
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
    title: 'Ajal de Raiz - Vivero & Jardinería',
    description: 'Un toque verde para la vida moderna. Plantas, herramientas y todo lo que necesitas para tu jardín.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=Cormorant+Garamond:wght@400;700&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
