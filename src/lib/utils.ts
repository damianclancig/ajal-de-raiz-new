import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const NO_IMAGE_URL = 'https://res.cloudinary.com/dqh1coa3c/image/upload/v1754481735/ajal-de-raiz/no-image_iz3ekz.png';
