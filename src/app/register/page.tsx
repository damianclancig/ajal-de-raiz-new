
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import Link from "next/link";
import RegisterForm from "@/components/auth/register-form";
import type { Metadata } from "next";

export default function RegisterPage() {
    const { t } = useLanguage();

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
