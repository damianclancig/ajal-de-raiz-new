/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { Ban, Loader2 } from 'lucide-react';
import { cancelOrder } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/notification-context';

interface CancelOrderButtonProps {
    orderId: string;
}

export default function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const { refreshPendingCount } = useNotification();

  const handleCancel = () => {
    startTransition(async () => {
        const result = await cancelOrder(orderId);
        if (result.success) {
            toast({ 
                title: "Pedido Cancelado", 
                description: "Tu pedido ha sido cancelado exitosamente." 
            });
            await refreshPendingCount();
            router.refresh(); 
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive"
            });
        }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Ban className="mr-2 h-4 w-4" />
          Cancelar Pedido
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Tu pedido será cancelado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center sm:gap-4">
          <AlertDialogCancel disabled={isPending}>No</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} disabled={isPending} variant="destructive">
             {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sí, cancelar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
