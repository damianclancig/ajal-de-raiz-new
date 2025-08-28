
import { cookies } from "next/headers";
import type { Language } from "./types";

export const getLanguage = (): Language => {
    const cookieStore = cookies();
    const langCookie = cookieStore.get('language');
    const lang = langCookie?.value;
    if (lang === 'en' || lang === 'es' || lang === 'pt') {
        return lang;
    }
    return 'es'; 
};
