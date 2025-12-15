
import UserForm from '@/components/admin/user-form';
import { getUserById } from '@/lib/user-service';
import { notFound } from 'next/navigation';

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
