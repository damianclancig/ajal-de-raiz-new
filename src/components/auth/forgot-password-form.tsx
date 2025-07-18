
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
import { requestPasswordReset } from "@/lib/actions";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export default function ForgotPasswordForm() {
    const [isPending, startTransition] = useTransition();
    const { t } = useLanguage();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append('email', values.email);
            
            const result = await requestPasswordReset(formData);
            
            if (result.success) {
                 toast({ 
                    title: t('Reset_Success_Title'), 
                    description: t('Reset_Success_Desc') 
                });
                form.reset();
            } else {
                 toast({ 
                    title: t('Reset_Error_Title'), 
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
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('Send_Reset_Link')}
                </Button>
            </form>
        </Form>
    );
}
