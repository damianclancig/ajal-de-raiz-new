
"use client";

import { useTransition, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/lib/actions";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { useTheme } from "next-themes";

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition();
    const { t } = useLanguage();
    const { toast } = useToast();
    const router = useRouter();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isVerified, setIsVerified] = useState(false);
    const { theme } = useTheme();

    const handleRecaptchaChange = (token: string | null) => {
        setIsVerified(!!token);
    };

    const formSchema = z.object({
        name: z.string().min(2, { message: "Name must be at least 2 characters." }),
        email: z.string().email({ message: "Invalid email address." }),
        password: z
            .string()
            .min(8, { message: t('Password_min_8_chars') })
            .regex(/[0-9]/, { message: t('Password_one_number') })
            .regex(/[^a-zA-Z0-9]/, { message: t('Password_one_special_char') }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const recaptchaToken = recaptchaRef.current?.getValue();
        if (!recaptchaToken) {
            toast({
                variant: "destructive",
                title: "Verificación requerida",
                description: "Por favor, completa el reCAPTCHA.",
            });
            return;
        }

        startTransition(async () => {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('g-recaptcha-response', recaptchaToken);

            const result = await registerUser(formData);

            if (result?.success === false) {
                toast({ title: t('Register_Error_Title'), description: result.message, variant: "destructive" });
            } else {
                toast({
                    title: t('Register_Success_Title'),
                    description: t('Register_Success_Desc')
                });

                // Sign in the user after successful registration
                const signInResult = await signIn('credentials', {
                    redirect: false,
                    email: values.email,
                    password: values.password,
                });

                if (signInResult?.ok) {
                    router.push('/register/complete-profile');
                } else {
                    // Handle sign-in error, though it's unlikely if registration just succeeded
                    toast({ title: "Error", description: "Failed to log in after registration.", variant: "destructive" });
                    router.push('/login');
                }
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Full_Name')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('Full_Name')} {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Email')}</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder={t('Placeholder_Email')} {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Password')}</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} disabled={isPending} />
                            </FormControl>
                            <FormDescription>
                                {t('Password_Requirements')}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-center w-full">
                    <div className="rounded-md overflow-hidden">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            onChange={handleRecaptchaChange}
                            theme={theme === 'dark' ? 'dark' : 'light'}
                            key={theme}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isPending || !isVerified}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('Register')}
                </Button>
            </form>
        </Form>
    );
}
