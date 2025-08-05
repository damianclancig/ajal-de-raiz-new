
import { getAllUsers } from '@/lib/user-service';
import AdminUsersPageClient from '@/components/admin/admin-users-page-client';

export const revalidate = 0;

export default async function UsersPage() {
  const users = await getAllUsers();
  
  return (
    <div>
      <AdminUsersPageClient initialUsers={users} />
    </div>
  );
}
