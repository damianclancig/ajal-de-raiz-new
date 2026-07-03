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


import { getCurrentUser } from "@/lib/user-service";
import ProfileClientPage from "./_components/profile-client-page";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Perfil',
  description: 'Gestiona la información de tu cuenta, tu foto de perfil y tus datos de envío.',
  robots: {
    index: false,
    follow: false,
  }
};

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        notFound();
    }
    
    return <ProfileClientPage user={user} />;
}
