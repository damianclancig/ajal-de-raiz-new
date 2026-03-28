import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Cuenta | Ajal de Raíz',
  description: 'Regístrate en Ajal de Raíz para comprar plantas, kokedamas y accesorios de jardinería online.',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
