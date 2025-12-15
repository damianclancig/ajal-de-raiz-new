'use server';

import { verifyRecaptcha } from '@/lib/utils-server';
import { sendContactRequestEmail } from '@/lib/email-service';
import type { ActionResponse } from '@/lib/types';

export async function handleContactForm(formData: FormData): Promise<ActionResponse> {
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const token = formData.get('g-recaptcha-response') as string;

    // 1. Validate reCAPTCHA token
    const captchaValidation = await verifyRecaptcha(token);
    if (!captchaValidation.success) {
        return { success: false, message: captchaValidation.message || 'Captcha failed' };
    }

    // 2. Validate form data
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return { success: false, message: 'Por favor, ingresa un correo electrónico válido.' };
    }
    if (!message) {
        return { success: false, message: 'Por favor, escribe un mensaje.' };
    }

    // 3. Send email
    try {
        await sendContactRequestEmail(email, message);
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to send contact email: ${errorMessage}` };
    }
}
