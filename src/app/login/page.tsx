
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
/*
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Inicia sesión en tu cuenta de Ajal de Raiz para acceder a tu perfil y pedidos.',
};
*/
function LoginButton() {
  const { pending } = useFormStatus();
  const { t } = useLanguage();

  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('Logging_In')}
        </>
      ) : (
        t('Login')
      )}
    </Button>
  );
}

function LoginForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleSignIn = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    await signIn('credentials', { 
        email, 
        password, 
        redirectTo: '/' 
    });
  }

  return (
    <form action={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('Email')}</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          placeholder={t('Placeholder_Email')} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('Password')}</Label>
        <Input 
          id="password" 
          name="password"
          type="password" 
          required 
        />
      </div>
       {error === 'CredentialsSignin' && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>{t('Login_Error_Description')}</p>
        </div>
      )}
      <LoginButton />
    </form>
  )
}

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">{t('Welcome_Back')}</CardTitle>
          <CardDescription>{t('Enter_your_credentials_to_log_in')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-[236px] w-full animate-pulse bg-muted/50 rounded-md" />}>
            <LoginForm />
          </Suspense>
        </CardContent>
        <CardFooter className="flex-col items-center space-y-2 text-sm">
           <div className="flex justify-between w-full">
            <Button variant="link" size="sm" asChild className="p-0 h-auto">
                <Link href="/forgot-password">{t('Forgot_Password')}</Link>
            </Button>
            <Button variant="link" size="sm" asChild className="p-0 h-auto">
                <Link href="/register">{t('Create_Account')}</Link>
            </Button>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}
