'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/product-service'; // Shared db
import type { ActionResponse, SlideState } from '@/lib/types';

export async function createSlide(formData: FormData): Promise<ActionResponse> {
    try {
        const db = await getDb();
        const slidesCollection = db.collection('heroSlides');

        const headline = formData.get('headline') as string;
        const subtext = formData.get('subtext') as string;
        const image = formData.get('image') as string;
        const state = formData.get('state') as SlideState;
        const buttonLink = formData.get('buttonLink') as string;


        if (!image) {
            return { success: false, message: 'Image is required.' };
        }

        if (!['habilitado', 'deshabilitado'].includes(state)) {
            return { success: false, message: 'Invalid state value.' };
        }

        const newSlideData = {
            headline,
            subtext,
            image,
            buttonLink,
            state,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await slidesCollection.insertOne(newSlideData);
        if (!result.insertedId) {
            throw new Error('Failed to create slide.');
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to create slide: ${message}` };
    }

    revalidatePath('/admin/slides');
    revalidatePath('/');
    redirect('/admin/slides');
}

export async function updateSlide(slideId: string, formData: FormData): Promise<ActionResponse> {
    try {
        if (!ObjectId.isValid(slideId)) {
            return { success: false, message: 'Invalid slide ID.' };
        }
        const db = await getDb();
        const slidesCollection = db.collection('heroSlides');

        const headline = formData.get('headline') as string;
        const subtext = formData.get('subtext') as string;
        const image = formData.get('image') as string;
        const state = formData.get('state') as SlideState;
        const buttonLink = formData.get('buttonLink') as string;


        if (!image) {
            return { success: false, message: 'Image is required.' };
        }

        if (!['habilitado', 'deshabilitado'].includes(state)) {
            return { success: false, message: 'Invalid state value.' };
        }

        const updateData = {
            headline,
            subtext,
            image,
            buttonLink,
            state,
            updatedAt: new Date(),
        };

        const result = await slidesCollection.updateOne(
            { _id: new ObjectId(slideId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: 'Slide not found.' };
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update slide: ${message}` };
    }

    revalidatePath('/admin/slides');
    revalidatePath(`/admin/slides/${slideId}/edit`);
    revalidatePath('/');
    redirect('/admin/slides');
}

export async function deleteSlide(slideId: string): Promise<ActionResponse> {
    try {
        if (!ObjectId.isValid(slideId)) {
            return { success: false, message: 'Invalid slide ID.' };
        }
        const db = await getDb();
        const slidesCollection = db.collection('heroSlides');

        const result = await slidesCollection.deleteOne({ _id: new ObjectId(slideId) });

        if (result.deletedCount === 0) {
            return { success: false, message: 'Slide not found.' };
        }

        revalidatePath('/admin/slides');
        revalidatePath('/');

        return { success: true, message: 'Slide deleted successfully.' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete slide: ${message}` };
    }
}
