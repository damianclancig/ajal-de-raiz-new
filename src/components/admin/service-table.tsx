
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

interface ServiceTableProps {
  initialServices: Service[];
}

export default function ServiceTable({ initialServices }: ServiceTableProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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
                    <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                            <Link href={`/admin/services/${service.id}/edit`}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={isPending}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente el servicio.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(service.id)} className="bg-destructive hover:bg-destructive/90">
                                        Eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
