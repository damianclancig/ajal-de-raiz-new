
"use client";

import React, { useTransition } from 'react';
import type { User } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Edit, ShieldCheck, User as UserIcon, Phone, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
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
import { deleteUser } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { TableActions } from './table-actions';

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const { t } = useLanguage();
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (userId: string) => {
    startDeleteTransition(async () => {
      const result = await deleteUser(userId);
      if (result.success) {
        toast({ title: t('Success'), description: t('User_deleted_successfully') });
      } else {
        toast({ title: t('Error_Title'), description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <TooltipProvider>
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {users.map((user) => (
              <Collapsible key={user.id} asChild>
                <div className="border-b last:border-b-0 even:bg-muted/25 transition-colors hover:bg-muted/50">
                  <div className="flex items-center px-4 py-3">
                    <CollapsibleTrigger asChild className="flex-1 cursor-pointer group">
                      <div className="flex items-center gap-4 text-left">
                        <Avatar>
                          <AvatarImage src={user.profileImage || undefined} alt={user.name} />
                          <AvatarFallback>
                            <UserIcon className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium group-hover:text-primary transition-colors">{user.name}</span>
                            {user.isAdmin && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span><ShieldCheck className="h-4 w-4 text-primary" /></span>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>{t('Is_Admin')}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          {user.phone && <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {user.phone}</div>}
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <TableActions 
                      editHref={`/admin/users/${user.id}/edit`}
                      onDelete={() => handleDelete(user.id)}
                      isDeleting={isDeleting}
                      editTooltip={t('Edit_User')}
                      deleteTooltip={t('Delete_User')}
                      deleteTitle={t('Delete_User_Title', { name: user.name })}
                      deleteDescription={t('Delete_User_Description', { name: user.name, email: user.email })}
                    />
                  </div>

                  <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <div className="bg-muted/30 p-4 text-sm border-t">
                      <h4 className="font-semibold mb-2">{t('Shipping_Address')}</h4>
                      {user.address && (user.address.street || user.address.city) ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-muted-foreground">
                          <div className="col-span-2"><strong>{t('Street')}:</strong> {user.address.street || '-'} {user.address.number || ''}</div>
                          <div><strong>{t('City')}:</strong> {user.address.city || '-'}</div>
                          <div><strong>{t('Zip_Code')}:</strong> {user.address.zipCode || '-'}</div>
                          <div><strong>{t('Province')}:</strong> {user.address.province || '-'}</div>
                          <div><strong>{t('Country')}:</strong> {user.address.country || '-'}</div>
                          {user.address.instructions && <div className="col-span-full pt-2"><strong>{t('Additional_Instructions')}:</strong> {user.address.instructions}</div>}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">{t('No_address_registered')}</p>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
