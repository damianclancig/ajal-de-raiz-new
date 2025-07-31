import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CompleteProfileForm from "@/components/auth/complete-profile-form";
import { getCurrentUser } from "@/lib/user-service";
import { redirect } from "next/navigation";

export default async function CompleteProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }
    
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">¡Un último paso!</CardTitle>
                    <CardDescription>
                        Completa tus datos de envío para agilizar tus futuras compras. 
                        Si prefieres, puedes omitir este paso y hacerlo más tarde desde el menú de usuario, en la sección <strong>"Mi Perfil"</strong>.
                    </CardDescription>
                </CardHeader>
                <CompleteProfileForm user={user} />
            </Card>
        </div>
    );
}
