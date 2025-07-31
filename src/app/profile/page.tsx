
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
