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
