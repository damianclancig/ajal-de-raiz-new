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



import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import CompleteProfileForm from "@/components/auth/complete-profile-form";
import { getCurrentUser } from "@/lib/user-service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/lib/actions";

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
                        Si prefieres, puedes omitir este paso haciendo clic en el botón de abajo y hacerlo más tarde desde el menú de usuario, en la sección <strong>"Mi Perfil"</strong>.
                    </CardDescription>
                </CardHeader>
                <CompleteProfileForm 
                  user={user} 
                  isSubmitting={false} 
                  onSuccess={async () => {
                      "use server"
                      redirect('/');
                  }}
                />
                 <CardFooter className="flex justify-end bg-muted/30 p-4 border-t">
                    <Button asChild type="button" variant="ghost">
                        <Link href="/">Omitir por ahora</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
