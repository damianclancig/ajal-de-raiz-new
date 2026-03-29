
'use client';

import React, { useState, useTransition } from 'react';
import type { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { deleteService } from '@/lib/actions';
import { TableActions } from './table-actions';
import { TooltipProvider } from '../ui/tooltip';
import { useLanguage } from '@/hooks/use-language';

interface ServiceTableProps {
  initialServices: Service[];
}

export default function ServiceTable({ initialServices }: ServiceTableProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleDelete = async (serviceId: string) => {
    startTransition(async () => {
      const result = await deleteService(serviceId);
      if (result.success) {
        setServices(prev => prev.filter(s => s.id !== serviceId));
        toast({ title: 'Servicio Eliminado', description: 'El servicio ha sido eliminado correctamente.' });
      } else {
        toast({ title: 'Error', description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <TooltipProvider>
      <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Icono</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Descripción</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map(service => {
              const Icon = (Icons as any)[service.icon] || Icons.Sprout;
              return (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground max-w-sm truncate" title={service.description}>
                    {service.description}
                  </TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end pr-2">
                        <TableActions 
                          editHref={`/admin/services/${service.id}/edit`}
                          onDelete={() => handleDelete(service.id)}
                          isDeleting={isPending}
                          deleteTitle={t('Delete_Service_Title', { title: service.title })}
                          deleteDescription={t('Delete_Service_Description', { title: service.title })}
                        />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      </Card>
    </TooltipProvider>
  );
}
