
"use client";

import * as React from 'react';
import type { User } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Edit, ShieldCheck, User as UserIcon, Phone } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const { t } = useLanguage();

  return (
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
                                    <AvatarImage src={user.profileImage} alt={user.name} />
                                    <AvatarFallback>
                                        <UserIcon className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-medium group-hover:text-primary">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                    {user.phone && <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone}</div>}
                                </div>
                            </div>
                        </CollapsibleTrigger>
                        
                        <div className="flex w-20 justify-end items-center gap-2">
                           <div className="md:hidden">
                             {user.isAdmin && <ShieldCheck className="h-5 w-5 text-primary" />}
                           </div>
                           <div className="hidden md:flex w-full justify-center">
                            {user.isAdmin ? (
                                <ShieldCheck className="h-5 w-5 text-primary" />
                            ) : (
                                <ShieldCheck className="h-5 w-5 text-muted-foreground/30" />
                            )}
                           </div>
                           <Button asChild variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <Link href={`/admin/users/${user.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit User</span>
                            </Link>
                          </Button>
                        </div>
                    </div>

                    <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                        <div className="bg-muted/30 p-4 text-sm border-t">
                            <h4 className="font-semibold mb-2">Dirección de Envío</h4>
                            {user.address && (user.address.street || user.address.city) ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-muted-foreground">
                                  <div className="col-span-2"><strong>Calle:</strong> {user.address.street || '-'} {user.address.number || ''}</div>
                                  <div><strong>Ciudad:</strong> {user.address.city || '-'}</div>
                                  <div><strong>CP:</strong> {user.address.zipCode || '-'}</div>
                                  <div><strong>Provincia:</strong> {user.address.province || '-'}</div>
                                  <div><strong>País:</strong> {user.address.country || '-'}</div>
                                  {user.address.instructions && <div className="col-span-full pt-2"><strong>Instrucciones:</strong> {user.address.instructions}</div>}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No hay dirección registrada.</p>
                            )}
                        </div>
                    </CollapsibleContent>
                 </div>
              </Collapsible>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
