
import type { Metadata } from 'next';
import LoginClientPage from './_components/login-client';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Inicia sesión en tu cuenta de Ajal de Raiz para acceder a tu perfil y pedidos.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClientPage />
    </Suspense>
  );
}
