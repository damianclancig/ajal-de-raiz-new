
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
import { updateUserProfile } from "@/lib/actions";
import { Textarea } from "../ui/textarea";
import Link from "next/link";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";

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
    showSkipButton?: boolean;
    isSubmitting?: boolean;
}

export default function CompleteProfileForm({ user, onSuccess, showSkipButton = true, isSubmitting: parentIsSubmitting = false }: CompleteProfileFormProps) {
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

        // This is for the initial registration flow
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
    
    // When used inside the Profile page, this component doesn't render its own form/buttons
    if (showSkipButton === false) {
         return (
            <Form {...form}>
                 {/* This form is controlled by the parent `ProfileClientPage`'s form tag */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Homero Simpson" {...field} name="name" disabled={isSubmitting} />
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
                                        <Input placeholder="Ej: 1122334455" {...field} name="phone" disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Dirección de Envío</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="street"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Calle</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Av. Siempreviva" {...field} name="street" disabled={isSubmitting} />
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
                                            <Input placeholder="Ej: 742" {...field} name="number" disabled={isSubmitting} />
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
                                            <Input placeholder="Ej: Springfield" {...field} name="city" disabled={isSubmitting} />
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
                                            <Input placeholder="Ej: Buenos Aires" {...field} name="province" disabled={isSubmitting} />
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
                                            <Input placeholder="Ej: 1605" {...field} name="zipCode" disabled={isSubmitting} />
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
                                        <Textarea placeholder="Ej: Tocar timbre, departamento 3B. Cuidado con el perro." {...field} name="instructions" disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </Form>
        );
    }

    // This is the standalone version for the /register/complete-profile page
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Dirección de Envío</h3>
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
                
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    {showSkipButton && (
                        <Button variant="link" asChild>
                            <Link href="/">Omitir por ahora</Link>
                        </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar y Continuar
                    </Button>
                </div>
            </form>
        </Form>
    );
}
