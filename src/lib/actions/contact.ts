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
