
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { cookies } from "next/headers";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Suspense } from "react";

const getLanguage = () => {
    const cookieStore = cookies();
    const langCookie = cookieStore.get('language');
    const lang = langCookie?.value;
    if (lang === 'en' || lang === 'es' || lang === 'pt') {
        return lang;
    }
    return 'es'; // Default language
};

function ResetPasswordContent() {
    const lang = getLanguage();
    const t = (key: keyof typeof translations) => translations[key][lang] || key;

    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">{t('Set_a_new_password')}</CardTitle>
                    <CardDescription>{t('Your_new_password_must_be_different')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResetPasswordForm />
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="link" size="sm" asChild>
                        <Link href="/login">{t('Back_to_Login')}</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
