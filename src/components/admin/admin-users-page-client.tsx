
"use client";

import UserTable from "@/components/admin/user-table";
import { useLanguage } from "@/hooks/use-language";
import type { User } from "@/lib/types";

interface AdminUsersPageClientProps {
    initialUsers: User[];
}

export default function AdminUsersPageClient({ initialUsers }: AdminUsersPageClientProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{t('User_Management')}</h1>
        <p className="text-muted-foreground">{t('Manage_your_users')}</p>
      </div>
      <UserTable users={initialUsers} />
    </>
  );
}
