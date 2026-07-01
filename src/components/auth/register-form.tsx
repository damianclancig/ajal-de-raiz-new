
"use client";

import { useTransition, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        confirmPassword: z.string().min(1, { message: t('Confirm_Password') + " is required" }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('Passwords_do_not_match'),
        path: ["confirmPassword"],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const recaptchaToken = recaptchaRef.current?.getValue();
        if (!recaptchaToken) {
            toast({
                variant: "destructive",
                title: t('Verification_Required'),
                description: t('Please_complete_recaptcha'),
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

    const password = form.watch('password');
    const confirmPassword = form.watch('confirmPassword');
    const passwordsMatch = password && confirmPassword && password === confirmPassword;

    const getStrength = (pass: string) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length >= 8) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const strength = getStrength(password || "");

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-muted";
        if (score === 1) return "bg-red-500 shadow-red-500/20";
        if (score === 2) return "bg-orange-500 shadow-orange-500/20";
        if (score === 3) return "bg-amber-500 shadow-amber-500/20";
        return "bg-emerald-500 shadow-emerald-500/20";
    };

    const getStrengthText = (score: number) => {
        if (score === 0) return "";
        if (score === 1) return t('Weak');
        if (score === 2) return t('Medium');
        if (score === 3) return t('Strong');
        return t('Very_Strong');
    };

    const passwordRequirements = [
        { key: 'min8', label: t('Password_min_8_chars'), met: (password?.length || 0) >= 8 },
        { key: 'number', label: t('Password_one_number'), met: /[0-9]/.test(password || "") },
        { key: 'special', label: t('Password_one_special_char'), met: /[^a-zA-Z0-9]/.test(password || "") },
    ];

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
                                <div className="relative">
                                    <Input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="******" 
                                        {...field} 
                                        disabled={isPending} 
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? t('Hide_Password') : t('Show_Password')}
                                        </span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormDescription>
                                <div className="space-y-3 pt-1">
                                    {/* Strength Bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex gap-1 h-1 w-full">
                                            {[1, 2, 3, 4].map((index) => (
                                                <div
                                                    key={index}
                                                    className={`flex-1 rounded-full transition-all duration-300 ${
                                                        strength >= index ? getStrengthColor(strength) : "bg-muted"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        {strength > 0 && (
                                            <div className="text-[10px] font-medium text-right uppercase tracking-wider">
                                                {getStrengthText(strength)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Active Requirements */}
                                    <div className="space-y-1.5">
                                        {passwordRequirements.some(r => !r.met) ? (
                                             <div className="space-y-1">
                                                 {passwordRequirements.filter(r => !r.met).map(r => (
                                                     <div 
                                                        key={r.key} 
                                                        className="text-[11px] text-muted-foreground flex items-center gap-1.5 animate-in fade-in slide-in-from-left-1 duration-200"
                                                     >
                                                         <div className="h-1 w-1 rounded-full bg-current opacity-40" />
                                                         {r.label}
                                                     </div>
                                                 ))}
                                             </div>
                                        ) : (
                                            password && (
                                                <div className="text-[11px] text-emerald-600 dark:text-emerald-500 font-medium flex items-center gap-1.5 animate-in zoom-in duration-300">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    {t('Password_Ready_Secure')}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Confirm_Password')}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder="******" 
                                        {...field} 
                                        disabled={isPending} 
                                        className={`pr-16 ${passwordsMatch ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                                    />
                                    <div className="absolute right-0 top-0 h-full flex items-center pr-3 space-x-1">
                                        {passwordsMatch && (
                                            <CheckCircle2 className="h-4 w-4 text-green-500 animate-in zoom-in duration-300" />
                                        )}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="sr-only">
                                                {showConfirmPassword ? t('Hide_Password') : t('Show_Password')}
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </FormControl>
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
