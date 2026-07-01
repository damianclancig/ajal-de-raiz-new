
"use client";

import React, { useTransition } from 'react';
import type { User } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { updateUser } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import { Textarea } from '../ui/textarea';

interface UserFormProps {
  user: User;
}

export default function UserForm({ user }: UserFormProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateUser(user.id, formData);

      if (result?.success === false) {
        toast({ title: t('Error_Title'), description: result.message, variant: "destructive" });
      } else {
        toast({ title: t('User_Updated_Title'), description: t('User_Saved_Desc') });
      }
    });
  };
  
  return (
    <form action={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{t('Update_User')}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('Name')}</Label>
                <Input id="name" name="name" defaultValue={user.name} required disabled={isPending}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('Phone_Number')}</Label>
                <Input id="phone" name="phone" defaultValue={user.phone} disabled={isPending} placeholder={t('Phone_Placeholder')}/>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <Label htmlFor="isAdmin">{t('Admin')}</Label>
                <Switch id="isAdmin" name="isAdmin" defaultChecked={user.isAdmin} disabled={isPending}/>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-base font-medium">{t('Shipping_Address')}</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street">{t('Street')}</Label>
                    <Input id="street" name="street" placeholder={t('Street_Placeholder')} defaultValue={user.address?.street} disabled={isPending} />
                  </div>
                   <div>
                    <Label htmlFor="number">{t('Number')}</Label>
                    <Input id="number" name="number" placeholder={t('Number_Placeholder')} defaultValue={user.address?.number} disabled={isPending} />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">{t('City')}</Label>
                    <Input id="city" name="city" placeholder={t('City_Placeholder')} defaultValue={user.address?.city} disabled={isPending} />
                  </div>
                  <div>
                    <Label htmlFor="province">{t('Province')}</Label>
                    <Input id="province" name="province" placeholder={t('Province_Placeholder')} defaultValue={user.address?.province} disabled={isPending} />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">{t('Zip_Code')}</Label>
                    <Input id="zipCode" name="zipCode" placeholder={t('Zip_Code_Placeholder')} defaultValue={user.address?.zipCode} disabled={isPending} />
                  </div>
               </div>
              <div>
                <Label htmlFor="instructions">{t('Additional_Instructions')}</Label>
                <Textarea id="instructions" name="instructions" placeholder={t('Placeholder_Instructions')} defaultValue={user.address?.instructions} disabled={isPending} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button asChild variant="secondary" disabled={isPending}>
              <Link href="/admin/users">{t('Cancel')}</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : t('Save')}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
