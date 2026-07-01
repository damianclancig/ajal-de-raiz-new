import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Ajal de Raíz',
  description: 'Conoce la historia detrás de Ajal de Raíz, nuestro compromiso con la naturaleza y las plantas de diseño para tu hogar.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
