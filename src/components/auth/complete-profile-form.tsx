

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { User } from "@/lib/types";
import { Separator } from "../ui/separator";
import { CardContent, CardFooter } from "../ui/card";
import PhoneNumberInput from "./phone-number-input";
import { useTransition } from "react";
import { updateUserProfile } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  instructions: z.string().optional(),
}).superRefine((data, ctx) => {
    const addressFields = [data.street, data.number, data.city, data.province, data.zipCode];
    const isAnyAddressFieldFilled = addressFields.some(field => field);

    if (isAnyAddressFieldFilled) {
        if (!data.street) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La calle es requerida.", path: ["street"] });
        }
        if (!data.city) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La ciudad es requerida.", path: ["city"] });
        }
        if (!data.province) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La provincia es requerida.", path: ["province"] });
        }
    }
});

type ProfileFormValues = z.infer<typeof formSchema>;

interface CompleteProfileFormProps {
    user: User | null;
    isSubmitting: boolean;
    onSuccess: () => void;
}

export default function CompleteProfileForm({ user, isSubmitting, onSuccess }: CompleteProfileFormProps) {
    
    // Helper to extract country code and number from a full phone string
    const parsePhoneNumber = (fullNumber?: string) => {
        if (!fullNumber) return { countryCode: '54', number: '' };
        if (fullNumber.startsWith('54')) return { countryCode: '54', number: fullNumber.substring(2) };
        if (fullNumber.startsWith('51')) return { countryCode: '51', number: fullNumber.substring(2) };
        if (fullNumber.startsWith('52')) return { countryCode: '52', number: fullNumber.substring(2) };
        return { countryCode: '54', number: fullNumber }; // Default to AR
    };

    const { countryCode, number: initialNumber } = parsePhoneNumber(user?.phone);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || "",
            countryCode: countryCode,
            phone: initialNumber,
            street: user?.address?.street || "",
            number: user?.address?.number || "",
            city: user?.address?.city || "",
            province: user?.address?.province || "",
            country: user?.address?.country || "Argentina",
            zipCode: user?.address?.zipCode || "",
            instructions: user?.address?.instructions || "",
        },
    });

    const onSubmit = async (values: ProfileFormValues) => {
        const formData = new FormData();
        
        const fullPhoneNumber = values.countryCode && values.phone ? `${values.countryCode}${values.phone}` : '';

        Object.keys(values).forEach(key => {
            const formKey = key as keyof ProfileFormValues;
            if (formKey === 'phone' || formKey === 'countryCode') return;
            
            const value = values[formKey];
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        formData.append('phone', fullPhoneNumber);
        
        await updateUserProfile(formData);
        onSuccess();
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
                                     <PhoneNumberInput form={form} disabled={isSubmitting} />
                                )}
                            />
                        </div>
                        
                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-base font-medium text-center md:text-left">Dirección de Envío (Opcional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="street"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Calle</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Av. Siempreviva" {...field} disabled={isSubmitting} value={field.value ?? ''} />
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
                                                <Input placeholder="Ej: 742" {...field} disabled={isSubmitting} value={field.value ?? ''} />
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
                                                <Input placeholder="Ej: Springfield" {...field} disabled={isSubmitting} value={field.value ?? ''} />
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
                                                <Input placeholder="Ej: Buenos Aires" {...field} disabled={isSubmitting} value={field.value ?? ''} />
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
                                                <Input placeholder="Ej: 1605" {...field} disabled={isSubmitting} value={field.value ?? ''} />
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
                                            <Textarea placeholder="Ej: Tocar timbre, departamento 3B. Cuidado con el perro." {...field} disabled={isSubmitting} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-muted/30 p-4 border-t">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Cambios
                    </Button>
                </CardFooter>
            </form>
        </Form>
    );
}
