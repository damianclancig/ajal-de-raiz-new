
'use client';

import { useTransition } from 'react';
import type { Service } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createService, updateService } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
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

const getServiceFormSchema = (t: any) => z.object({
    icon: z.enum(availableIcons),
    title: z.string().min(3, t('Title_Required')),
    description: z.string().min(10, t('Description_Required')),
    price: z.string().min(1, t('Price_Required')),
    details: z.string().optional(),
    note: z.string().optional(),
});

interface ServiceFormProps {
    service?: Service | null;
}

export default function ServiceForm({ service }: ServiceFormProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const { t } = useLanguage();
    
    const serviceFormSchema = getServiceFormSchema(t);
    type ServiceFormValues = z.infer<typeof serviceFormSchema>;

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
                toast({ title: service ? t('Service_Updated') : t('Service_Created'), description: t('Service_Saved_Success') });
            } else {
                toast({ title: t('Error_Title'), description: result.message, variant: 'destructive' });
            }
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>{service ? t('Edit_Service') : t('Create_New_Service')}</CardTitle>
                    <CardDescription>{t('Service_Form_Description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="title">{t('Service_Title')}</Label>
                            <Input id="title" {...form.register('title')} placeholder={t('Ex_Service_Title')} disabled={isPending} />
                            {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">{t('Price')}</Label>
                            <Input id="price" {...form.register('price')} placeholder={t('Ex_Service_Price')} disabled={isPending} />
                            {form.formState.errors.price && <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>}
                        </div>
                        <div className="space-y-2">
                           <Label>{t('Icon')}</Label>
                            <Select onValueChange={field => form.setValue('icon', field as any)} defaultValue={form.getValues('icon')}>
                                <SelectTrigger disabled={isPending}>
                                    <SelectValue placeholder={t('Select_an_icon')} />
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
                        <Label htmlFor="description">{t('Short_Description')}</Label>
                        <Input id="description" {...form.register('description')} placeholder={t('Short_Description_Placeholder')} disabled={isPending}/>
                        {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="details">{t('Details_Checklist')}</Label>
                        <Textarea id="details" {...form.register('details')} placeholder={t('Details_Placeholder')} rows={5} disabled={isPending} />
                        <p className="text-xs text-muted-foreground">{t('Details_Helper_Text')}</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="note">{t('Additional_Note_Optional')}</Label>
                        <Input id="note" {...form.register('note')} placeholder={t('Ex_Additional_Note')} disabled={isPending}/>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="secondary" asChild disabled={isPending}>
                        <Link href="/admin/services">{t('Cancel')}</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('Save_Service')}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
