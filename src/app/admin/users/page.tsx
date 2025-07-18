
import { getAllUsers } from '@/lib/user-service';
import AdminUsersPageClient from '@/components/admin/admin-users-page-client';

export default async function UsersPage() {
  const users = await getAllUsers();
  
  return (
    <div>
      <AdminUsersPageClient initialUsers={users} />
    </div>
  );
}
