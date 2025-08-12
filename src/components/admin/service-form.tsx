
'use client';

import { useTransition } from 'react';
import type { Service } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createService, updateService } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import * as Icons from 'lucide-react';

const availableIcons = [
    'Droplets', 'Leaf', 'Sprout', 'HeartHandshake', 'Cannabis', 'Sparkles', 'Sun', 'Moon'
] as const;

const serviceFormSchema = z.object({
    icon: z.enum(availableIcons),
    title: z.string().min(3, 'El título es requerido'),
    description: z.string().min(10, 'La descripción es requerida'),
    price: z.string().min(1, 'El precio es requerido'),
    details: z.string().optional(),
    note: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
    service?: Service | null;
}

export default function ServiceForm({ service }: ServiceFormProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    
    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: {
            icon: (service?.icon as any) || 'Sprout',
            title: service?.title || '',
            description: service?.description || '',
            price: service?.price || '',
            details: service?.details.join('\n') || '',
            note: service?.note || '',
        }
    });

    const onSubmit = (data: ServiceFormValues) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value);
            }
        });

        startTransition(async () => {
            const action = service 
                ? updateService.bind(null, service.id) 
                : createService;
            
            const result = await action(formData);
            if (result.success) {
                toast({ title: service ? 'Servicio Actualizado' : 'Servicio Creado', description: 'El servicio ha sido guardado exitosamente.' });
            } else {
                toast({ title: 'Error', description: result.message, variant: 'destructive' });
            }
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>{service ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</CardTitle>
                    <CardDescription>Completa los detalles del servicio que ofreces.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="title">Título del Servicio</Label>
                            <Input id="title" {...form.register('title')} placeholder="Ej: Mantenimiento de Kokedamas" disabled={isPending} />
                            {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio</Label>
                            <Input id="price" {...form.register('price')} placeholder="Ej: $25.000 por hora" disabled={isPending} />
                            {form.formState.errors.price && <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>}
                        </div>
                        <div className="space-y-2">
                           <Label>Icono</Label>
                            <Select onValueChange={field => form.setValue('icon', field as any)} defaultValue={form.getValues('icon')}>
                                <SelectTrigger disabled={isPending}>
                                    <SelectValue placeholder="Selecciona un ícono" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableIcons.map(iconName => {
                                        const IconComponent = (Icons as any)[iconName];
                                        return (
                                            <SelectItem key={iconName} value={iconName}>
                                                <div className="flex items-center gap-2">
                                                    <IconComponent className="h-4 w-4" />
                                                    <span>{iconName}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Descripción Corta</Label>
                        <Input id="description" {...form.register('description')} placeholder="Un resumen atractivo del servicio." disabled={isPending}/>
                        {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="details">Detalles (Checklist)</Label>
                        <Textarea id="details" {...form.register('details')} placeholder="Escribe cada detalle en una nueva línea..." rows={5} disabled={isPending} />
                        <p className="text-xs text-muted-foreground">Cada línea se convertirá en un ítem de la lista de detalles.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="note">Nota Adicional (Opcional)</Label>
                        <Input id="note" {...form.register('note')} placeholder="Ej: Costo adicional por retiro a domicilio." disabled={isPending}/>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="secondary" asChild disabled={isPending}>
                        <Link href="/admin/services">Cancelar</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Servicio
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
