'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/product-service'; // Shared db access
import type { ActionResponse, Service } from '@/lib/types';

export async function createService(formData: FormData): Promise<ActionResponse> {
    try {
        const db = await getDb();
        const servicesCollection = db.collection('services');

        const details = (formData.get('details') as string)
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const newService: Omit<Service, 'id'> = {
            icon: formData.get('icon') as string,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            details,
            price: formData.get('price') as string,
            note: formData.get('note') as string,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (!newService.title || !newService.icon) {
            return { success: false, message: 'Title and Icon are required.' };
        }

        await servicesCollection.insertOne(newService);

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to create service: ${message}` };
    }
    revalidatePath('/admin/services');
    revalidatePath('/');
    redirect('/admin/services');
}

export async function updateService(serviceId: string, formData: FormData): Promise<ActionResponse> {
    if (!ObjectId.isValid(serviceId)) {
        return { success: false, message: 'Invalid service ID.' };
    }
    try {
        const db = await getDb();
        const servicesCollection = db.collection('services');

        const details = (formData.get('details') as string)
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const updateData: Partial<Service> = {
            icon: formData.get('icon') as string,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            details,
            price: formData.get('price') as string,
            note: formData.get('note') as string,
            updatedAt: new Date().toISOString(),
        };

        if (!updateData.title || !updateData.icon) {
            return { success: false, message: 'Title and Icon are required.' };
        }

        const result = await servicesCollection.updateOne(
            { _id: new ObjectId(serviceId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: 'Service not found.' };
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update service: ${message}` };
    }
    revalidatePath('/admin/services');
    revalidatePath('/');
    redirect('/admin/services');
}

export async function deleteService(serviceId: string): Promise<ActionResponse> {
    if (!ObjectId.isValid(serviceId)) {
        return { success: false, message: 'Invalid service ID.' };
    }
    try {
        const db = await getDb();
        const servicesCollection = db.collection('services');
        const result = await servicesCollection.deleteOne({ _id: new ObjectId(serviceId) });

        if (result.deletedCount === 0) {
            return { success: false, message: 'Service not found.' };
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete service: ${message}` };
    }
    revalidatePath('/admin/services');
    revalidatePath('/');
    return { success: true, message: 'Service deleted successfully.' };
}
