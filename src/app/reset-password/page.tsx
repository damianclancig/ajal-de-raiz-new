/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
