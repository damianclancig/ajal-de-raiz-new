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
