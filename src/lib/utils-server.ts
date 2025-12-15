
import { cookies } from "next/headers";
import type { Language } from "./types";

export const getLanguage = async (): Promise<Language> => {
    const cookieStore = await cookies();
    const langCookie = cookieStore.get('language');
    const lang = langCookie?.value;
    if (lang === 'en' || lang === 'es' || lang === 'pt') {
        return lang;
    }
    return 'es';
};

// Helper function to create a URL-friendly slug
export const createSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

export const getImagesFromFormData = (formData: FormData): string[] => {
    const images: string[] = [];
    formData.forEach((value, key) => {
        if (key.startsWith('images[')) {
            images.push(value as string);
        }
    });
    return images;
};

// --- ReCAPTCHA Helper ---
export async function verifyRecaptcha(token: string | null): Promise<{ success: boolean; message?: string }> {
    if (!token) {
        return { success: false, message: 'Verificación reCAPTCHA fallida. Por favor, inténtalo de nuevo.' };
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;

    try {
        const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
        const recaptchaData = await recaptchaRes.json();

        if (!recaptchaData.success) {
            console.error('reCAPTCHA verification failed:', recaptchaData['error-codes']);
            return { success: false, message: 'La verificación de reCAPTCHA falló. Eres un robot?' };
        }
        return { success: true };
    } catch (e) {
        console.error('Error verifying reCAPTCHA:', e);
        return { success: false, message: 'No se pudo verificar reCAPTCHA. Comprueba tu conexión.' };
    }
}
