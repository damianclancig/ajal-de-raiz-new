
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { cookies } from "next/headers";
import RegisterForm from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Crear Cuenta",
    description: "Regístrate en Ajal de Raiz para empezar a comprar y guardar tus productos favoritos.",
};

const getLanguage = () => {
    const cookieStore = cookies();
    const langCookie = cookieStore.get('language');
    const lang = langCookie?.value;
    if (lang === 'en' || lang === 'es' || lang === 'pt') {
        return lang;
    }
    return 'es'; // Default language
};

export default function RegisterPage() {
    const lang = getLanguage();
    const t = (key: keyof typeof translations) => translations[key][lang] || key;

    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">{t('Create_your_account')}</CardTitle>
                    <CardDescription>{t('Enter_your_details_to_get_started')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
                 <CardFooter className="justify-center">
                    <Button variant="link" size="sm" asChild>
                        <Link href="/login">
                            {t('Already_have_an_account')} {t('Login')}
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
