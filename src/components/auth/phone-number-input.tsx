
"use client";

import { Controller, useFormContext, type UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useWatch } from "react-hook-form";

const countryConfig = {
    '54': { name: 'Argentina (+54)', description: 'Ingresa tu número de 10 dígitos (ej: 1122334455). No incluyas el 0 ni el 15.' },
    '51': { name: 'Perú (+51)', description: 'Ingresa tu número de 9 dígitos.' },
    '52': { name: 'México (+52)', description: 'Ingresa tu número de 10 dígitos.' },
};

type CountryCode = keyof typeof countryConfig;

interface PhoneNumberInputProps {
    form: UseFormReturn<any>;
    disabled?: boolean;
}

export default function PhoneNumberInput({ form, disabled }: PhoneNumberInputProps) {
    const selectedCountryCode = useWatch({
        control: form.control,
        name: "countryCode",
    }) as CountryCode;

    const description = countryConfig[selectedCountryCode]?.description || 'Selecciona un país.';

    return (
        <FormItem>
            <FormLabel>Teléfono / WhatsApp</FormLabel>
            <div className="flex gap-2">
                <Controller
                    name="countryCode"
                    control={form.control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
                            <FormControl>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="País" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.entries(countryConfig).map(([code, { name }]) => (
                                    <SelectItem key={code} value={code}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <Controller
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                         <FormControl>
                            <Input 
                                placeholder="Número de teléfono" 
                                {...field} 
                                disabled={disabled} 
                                type="tel"
                                value={field.value ?? ''}
                            />
                        </FormControl>
                    )}
                />
            </div>
            <FormDescription>
                {description}
            </FormDescription>
            <FormMessage />
        </FormItem>
    );
}
