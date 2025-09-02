
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Suspense } from "react";
import { useLanguage } from "@/hooks/use-language";

function ResetPasswordContent() {
    const { t } = useLanguage();

    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">{t('Set_a_new_password')}</CardTitle>
                    <CardDescription>{t('Your_new_password_must_be_different')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="h-[188px] w-full animate-pulse bg-muted/50 rounded-md" />}>
                      <ResetPasswordForm />
                    </Suspense>
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
  return <ResetPasswordContent />
}
