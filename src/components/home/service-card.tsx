
'use client';

import type { Service } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle } from 'lucide-react';
import * as Icons from 'lucide-react';

interface ServiceCardProps {
    service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    const Icon = (Icons as any)[service.icon] || Icons.Sprout;

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex flex-row items-center gap-4 mb-2">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                </div>
                <CardDescription className="text-base text-foreground/80 font-bold">{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <ul className="space-y-2">
                    {service.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{detail}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="flex flex-col items-start bg-muted/50 p-4 mt-auto">
                <div className="font-bold text-lg text-primary">{service.price}</div>
                {service.note && (
                    <p className="text-xs text-muted-foreground mt-1">{service.note}</p>
                )}
            </CardFooter>
        </Card>
    );
}
