'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/product-service'; // Using shared getDb
import type { ActionResponse, Address } from '@/lib/types';

export async function updateUser(userId: string, formData: FormData): Promise<ActionResponse> {
    try {
        if (!ObjectId.isValid(userId)) {
            return { success: false, message: 'Invalid user ID.' };
        }
        const db = await getDb();
        const usersCollection = db.collection('users');

        const name = formData.get('name') as string;
        if (!name) {
            return { success: false, message: 'Name is required.' };
        }

        const address: Address = {
            street: formData.get('street') as string,
            number: formData.get('number') as string,
            city: formData.get('city') as string,
            province: formData.get('province') as string,
            country: formData.get('country') as string,
            zipCode: formData.get('zipCode') as string,
            instructions: formData.get('instructions') as string,
        };

        const updateData = {
            name: name,
            isAdmin: formData.get('isAdmin') === 'on',
            phone: formData.get('phone') as string,
            address: address,
            updatedAt: new Date(),
        };

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: 'User not found.' };
        }

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update user: ${message}` };
    }

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${userId}/edit`);
    redirect('/admin/users');
}

export async function deleteUser(userId: string): Promise<ActionResponse> {
    try {
        if (!ObjectId.isValid(userId)) {
            return { success: false, message: 'Invalid user ID.' };
        }
        const db = await getDb();
        const usersCollection = db.collection('users');

        const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            return { success: false, message: 'User not found.' };
        }

        revalidatePath('/admin/users');
        return { success: true, message: 'User deleted successfully.' };

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete user: ${message}` };
    }
}
