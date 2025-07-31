"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/actions";
import { Textarea } from "../ui/textarea";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { CardContent, CardFooter } from "../ui/card";

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
    user: User;
}

export default function CompleteProfileForm({ user }: CompleteProfileFormProps) {
    const [isPending, startTransition] = useTransition();
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

        startTransition(async () => {
            const result = await updateUserProfile(formData);
            if (result.success) {
                 toast({ 
                    title: "Perfil Guardado", 
                    description: "Tu información de envío ha sido guardada." 
                });
                router.push('/');
            } else {
                 toast({ 
                    title: "Error", 
                    description: result.message,
                    variant: 'destructive'
                });
            }
        });
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre Completo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Homero Simpson" {...field} disabled={isPending} />
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
                                            <Input placeholder="Ej: 1122334455" {...field} disabled={isPending} />
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
                                                <Input placeholder="Ej: Av. Siempreviva" {...field} disabled={isPending} />
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
                                                <Input placeholder="Ej: 742" {...field} disabled={isPending} />
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
                                                <Input placeholder="Ej: Springfield" {...field} disabled={isPending} />
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
                                                <Input placeholder="Ej: Buenos Aires" {...field} disabled={isPending} />
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
                                                <Input placeholder="Ej: 1605" {...field} disabled={isPending} />
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
                                            <Textarea placeholder="Ej: Tocar timbre, departamento 3B. Cuidado con el perro." {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/30 p-4 border-t">
                    <Button asChild type="button" variant="ghost" disabled={isPending}>
                        <Link href="/">Omitir por ahora</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar y Continuar
                    </Button>
                </CardFooter>
            </form>
        </Form>
    );
}