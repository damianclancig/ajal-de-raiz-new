

"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/use-language";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next';
import LoginClientPage from './_components/login-client';
import { Suspense } from 'react';

/*
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
