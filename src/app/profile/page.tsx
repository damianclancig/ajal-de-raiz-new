
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/user-service";
import CompleteProfileForm from "@/components/auth/complete-profile-form";
import ProfileClientPage from "./_components/profile-client-page";
import { notFound } from "next/navigation";

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        notFound();
    }
    
    return <ProfileClientPage user={user} />;
}
