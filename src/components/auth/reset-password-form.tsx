
"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/lib/actions";
import { useSearchParams, useRouter } from 'next/navigation'

const formSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

export default function ResetPasswordForm() {
    const [isPending, startTransition] = useTransition();
    const { t } = useLanguage();
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (!token) {
            toast({ title: "Error", description: "Invalid or missing password reset token.", variant: "destructive" });
            return;
        }

        startTransition(async () => {
            const formData = new FormData();
            formData.append('password', values.password);
            formData.append('token', token);
            
            const result = await resetPassword(formData);
            
            if (result.success) {
                 toast({ 
                    title: t('New_Password_Success_Title'), 
                    description: t('New_Password_Success_Desc')
                });
                router.push('/login');
            } else {
                 toast({ 
                    title: t('Error_Title'), 
                    description: result.message,
                    variant: 'destructive'
                });
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('Password')}</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
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
                                <Input type="password" placeholder="******" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isPending || !token}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('Save_New_Password')}
                </Button>
            </form>
        </Form>
    );
}
