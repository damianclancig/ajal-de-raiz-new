
import { Suspense } from "react";
import LoginClientPage from './_components/login-client';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Ajal de Raíz',
  description: 'Inicia sesión en tu cuenta de Ajal de Raíz para gestionar tus compras de plantas y kokedamas.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClientPage />
    </Suspense>
  );
}
