
"use client";

import * as React from "react";
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
import { updateUserProfile } from "@/lib/actions";
import { Textarea } from "../ui/textarea";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  phone: z.string().optional(),
  street: z.string().min(1, 'La calle es requerida'),
  number: z.string().optional(),
  city: z.string().min(1, 'La ciudad es requerida'),
  province: z.string().min(1, 'La provincia es requerida'),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  instructions: z.string().optional(),
});

interface CompleteProfileFormProps {
    user?: User | null;
    onSuccess?: () => void;
    isSubmitting?: boolean;
    onFormSubmit?: (formData: FormData) => void;
    children?: React.ReactNode;
}

export default function CompleteProfileForm({ 
    user, 
    onSuccess, 
    isSubmitting: parentIsSubmitting = false,
    onFormSubmit,
    children
}: CompleteProfileFormProps) {
    const [isPending, startTransition] = useTransition();
    const { t } = useLanguage();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || "",
            phone: user?.phone || "",
            street: user?.address?.street || "",
            number: user?.address?.number || "",
            city: user?.address?.city || "",
            province: user?.address?.province || "",
            country: user?.address?.country || "Argentina",
            zipCode: user?.address?.zipCode || "",
            instructions: user?.address?.instructions || "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            const value = values[key as keyof typeof values];
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        if (onFormSubmit) {
            onFormSubmit(formData);
            return;
        }

        startTransition(async () => {
            const result = await updateUserProfile(formData);
            if (result.success) {
                 toast({ 
                    title: "Perfil Actualizado", 
                    description: "Tu información ha sido guardada." 
                });
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push('/');
                }
            } else {
                 toast({ 
                    title: "Error", 
                    description: result.message,
                    variant: 'destructive'
                });
            }
        });
    };

    const isSubmitting = isPending || parentIsSubmitting;
    
    const formContent = (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre Completo</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Homero Simpson" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Teléfono / WhatsApp</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: 1122334455" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <Separator />

            <div className="space-y-4">
                <h3 className="text-base font-medium text-center md:text-left">Dirección de Envío</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Calle</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Av. Siempreviva" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: 742" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ciudad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Springfield" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Provincia</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Buenos Aires" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código Postal</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: 1605" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Indicaciones Adicionales</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Ej: Tocar timbre, departamento 3B. Cuidado con el perro." {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );

    if (children) {
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child) && child.props.className?.includes('p-6')) { // Find CardContent
                            return React.cloneElement(child as React.ReactElement<any>, {
                                children: formContent,
                            });
                        }
                         if (React.isValidElement(child)) { // For CardFooter
                            return child;
                         }
                        return null;
                    })}
                </form>
            </Form>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {formContent}
                 <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Guardar Cambios"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
