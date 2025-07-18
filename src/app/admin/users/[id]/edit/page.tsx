
import UserForm from '@/components/admin/user-form';
import { getUserById } from '@/lib/user-service';
import { notFound } from 'next/navigation';

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }
  
  return (
    <div>
      <UserForm user={user} />
    </div>
  );
}
