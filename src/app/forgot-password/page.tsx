
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { useLanguage } from "@/hooks/use-language";

export default function ForgotPasswordPage() {
    const { t } = useLanguage();
    
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">{t('Reset_your_password')}</CardTitle>
                    <CardDescription>{t('Enter_your_email_to_reset')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ForgotPasswordForm />
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
