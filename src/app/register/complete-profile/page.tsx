
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { cookies } from "next/headers";
import CompleteProfileForm from "@/components/auth/complete-profile-form";
import { Button } from "@/components/ui/button";

const getLanguage = () => {
    const cookieStore = cookies();
    const langCookie = cookieStore.get('language');
    const lang = langCookie?.value;
    if (lang === 'en' || lang === 'es' || lang === 'pt') {
        return lang;
    }
    return 'es'; // Default language
};

export default function CompleteProfilePage() {
    const lang = getLanguage();
    const t = (key: keyof typeof translations) => translations[key][lang] || key;
    
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">¡Un último paso!</CardTitle>
                    <CardDescription>Completa tu perfil para una mejor experiencia de compra. Puedes omitir este paso por ahora.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CompleteProfileForm />
                </CardContent>
            </Card>
        </div>
    );
}
