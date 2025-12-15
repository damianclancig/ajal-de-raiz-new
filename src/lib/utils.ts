import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const NO_IMAGE_URL = 'https://res.cloudinary.com/dqh1coa3c/image/upload/v1754481735/ajal-de-raiz/no-image_iz3ekz.png';

type Language = 'en' | 'es' | 'pt';

export const formatPrice = (price: number, lang: Language = 'es') => {
    const locale = lang === 'es' ? 'es-AR' : lang;
    return new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
};

export const formatDate = (dateString: string, lang: Language = 'es') => {
    const locale = lang === 'es' ? 'es-AR' : lang;
    return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};


