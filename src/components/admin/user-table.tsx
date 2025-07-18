
"use client";

import type { User } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, ShieldCheck, ShieldOff } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import Link from 'next/link';

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Name')}</TableHead>
              <TableHead>{t('Email')}</TableHead>
              <TableHead className="text-center">{t('Admin')}</TableHead>
              <TableHead className="text-center">{t('Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-center">
                  {user.isAdmin ? (
                    <ShieldCheck className="h-5 w-5 text-primary inline-block" />
                  ) : (
                    <ShieldOff className="h-5 w-5 text-muted-foreground inline-block" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/admin/users/${user.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
