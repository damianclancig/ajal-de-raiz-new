
'use client';

import { useState, useTransition } from 'react';
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import CompleteProfileForm from "@/components/auth/complete-profile-form";
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/actions';
import Image from 'next/image';
import { Loader2, UploadCloud, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

interface ProfileClientPageProps {
    user: User;
}

function ProfileImageUploader({ currentImage, onImageUpload, isSubmitting }: { currentImage?: string, onImageUpload: (url: string) => void, isSubmitting: boolean }) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        toast({ title: 'Subiendo imagen...', description: 'Por favor, espera.' });

        try {
            const transformation = 'w_128,h_128,c_fill,g_face,r_max';
            const resSign = await fetch('/api/sign-cloudinary-params', { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ transformation }) 
            });
            if (!resSign.ok) throw new Error('Failed to get signature.');
            
            const { signature, timestamp } = await resSign.json();
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('transformation', transformation);
            
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: formData });
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error.message || 'Cloudinary upload failed.');
            }
            
            const data = await res.json();
            onImageUpload(data.secure_url);
            toast({ title: 'Imagen subida', description: 'La imagen de perfil se ha actualizado.' });
        } catch (err: any) {
            console.error("Profile image upload error:", err);
            toast({ variant: 'destructive', title: 'Error de subida', description: err.message });
        } finally {
            setLoading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-32 rounded-full overflow-hidden bg-muted border-4 border-background shadow-lg">
                {currentImage ? (
                    <Image src={currentImage} alt="Foto de perfil" fill className="object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full w-full">
                       <UserIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                )}
            </div>
            <Button asChild variant="outline" size="sm" className="bg-background/80" disabled={loading || isSubmitting}>
                <label htmlFor="profile-image-upload" className="cursor-pointer">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                    Cambiar Foto
                    <Input id="profile-image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={loading || isSubmitting} />
                </label>
            </Button>
        </div>
    );
}

export default function ProfileClientPage({ user }: ProfileClientPageProps) {
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();
    const [profileImage, setProfileImage] = useState(user.profileImage);

    const handleProfileUpdateSuccess = async (updatedUser: { name?: string, image?: string}) => {
        await update({ user: { name: updatedUser.name, image: updatedUser.image } });
        router.refresh();
    };

    const handleFormSubmit = async (formData: FormData) => {
        if (profileImage) {
            formData.append('profileImage', profileImage);
        } else {
            formData.append('profileImage', '');
        }

        startTransition(async () => {
            const result = await updateUserProfile(formData);
            if (result.success) {
                toast({ title: "Perfil Actualizado", description: "Tu información ha sido guardada." });
                await handleProfileUpdateSuccess({ 
                    name: formData.get('name') as string,
                    image: profileImage
                });
            } else {
                toast({ title: "Error", description: result.message, variant: 'destructive' });
            }
        });
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <Card>
                <CardHeader className="text-center">
                    <ProfileImageUploader 
                        currentImage={profileImage}
                        onImageUpload={setProfileImage}
                        isSubmitting={isPending}
                    />
                    <CardTitle className="font-headline text-3xl pt-4">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                 <CompleteProfileForm 
                    user={user} 
                    isSubmitting={isPending}
                    onFormSubmit={handleFormSubmit}
                >
                    <CardContent className="p-6">
                       {/* The fields will be rendered here via CompleteProfileForm's children prop */}
                    </CardContent>
                    <CardFooter className="flex justify-end bg-muted/30 p-4 border-t">
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </CardFooter>
                </CompleteProfileForm>
            </Card>
        </div>
    );
}
