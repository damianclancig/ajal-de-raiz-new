'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { hash } from 'bcryptjs';
import crypto from 'crypto';
import { getDb } from '@/lib/product-service'; // Assuming keeping getDb here for now or should move it? It's in product-service currently. Use what actions.ts used.
import { sendPasswordResetEmail } from '@/lib/email-service';
import { auth } from '@/auth';
import { verifyRecaptcha } from '@/lib/utils-server';
import type { ActionResponse, User, Address } from '@/lib/types';
import { redirect } from 'next/navigation';

// Server Action pública para verificar captcha (usada en Login)
export async function verifyRecaptchaAction(token: string): Promise<{ success: boolean; message?: string }> {
    return await verifyRecaptcha(token);
}

export async function registerUser(formData: FormData): Promise<ActionResponse> {
    try {
        // Captcha Validation
        const token = formData.get('g-recaptcha-response') as string;
        const captchaValidation = await verifyRecaptcha(token);
        if (!captchaValidation.success) {
            return { success: false, message: captchaValidation.message || 'Captcha failed' };
        }

        const db = await getDb();
        const usersCollection = db.collection('users');

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!name || !email || !password) {
            return { success: false, message: 'Name, email, and password are required.' };
        }

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return { success: false, message: 'User with this email already exists.' };
        }

        const hashedPassword = await hash(password, 10);

        const newUser = {
            name,
            email,
            password: hashedPassword,
            isAdmin: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await usersCollection.insertOne(newUser);

        return { success: true, message: 'User created successfully.' };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to register user: ${message}` };
    }
}

export async function updateUserProfile(formData: FormData): Promise<ActionResponse> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const db = await getDb();
        const usersCollection = db.collection('users');
        const userId = new ObjectId(session.user.id);

        const address: Address = {
            street: formData.get('street') as string,
            number: formData.get('number') as string,
            city: formData.get('city') as string,
            province: formData.get('province') as string,
            country: "Argentina",
            zipCode: formData.get('zipCode') as string,
            instructions: formData.get('instructions') as string,
        };

        const updateData: Partial<User> & { $unset?: { profileImage?: string } } = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            address: address,
            updatedAt: new Date().toISOString(),
        };

        const profileImage = formData.get('profileImage') as string;

        if (profileImage) {
            updateData.profileImage = profileImage;
        } else {
            // If the profileImage field is present but empty, it means we should remove it.
            if (formData.has('profileImage')) {
                updateData.$unset = { profileImage: "" };
            }
        }

        const result = await usersCollection.updateOne(
            { _id: userId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: 'User not found.' };
        }

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update profile: ${message}';
        return { success: false, message: `Failed to update profile: ${message}` };
    }

    revalidatePath('/profile');
    revalidatePath('/cart');
    return { success: true, message: 'Profile updated successfully.' };
}

export async function requestPasswordReset(formData: FormData): Promise<ActionResponse> {
    const email = formData.get('email') as string;
    try {
        // Captcha Validation
        const token = formData.get('g-recaptcha-response') as string;
        const captchaValidation = await verifyRecaptcha(token);
        if (!captchaValidation.success) {
            return { success: false, message: captchaValidation.message || 'Captcha failed' };
        }

        const db = await getDb();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email });

        if (!user) {
            // Don't reveal if user exists or not
            return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };
        }

        // Generate a secure token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set expiry for 1 hour
        const passwordResetExpires = new Date(Date.now() + 3600000);

        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { passwordResetToken, passwordResetExpires } }
        );

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

        await sendPasswordResetEmail(user.email, user.name, resetUrl);

        return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };

    } catch (error) {
        const message = error instanceof Error ? `Failed to send email: ${error.message}` : 'An unknown error occurred while sending email.';
        console.error(message);
        return { success: false, message };
    }
}

export async function resetPassword(formData: FormData): Promise<ActionResponse> {
    const password = formData.get('password') as string;
    const token = formData.get('token') as string;

    if (!password || !token) {
        return { success: false, message: 'Password and token are required.' };
    }

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const db = await getDb();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() },
        });

        if (!user) {
            return { success: false, message: 'Invalid or expired password reset token.' };
        }

        const hashedPassword = await hash(password, 10);

        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { passwordResetToken: "", passwordResetExpires: "" },
            }
        );

        return { success: true, message: 'Password has been reset successfully.' };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message };
    }
}
