import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useLanguageStore } from "@/store/languageStore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale?: string): string {
  const d = new Date(date);
  // Get locale from language store if not provided
  const language = locale || useLanguageStore.getState().language;
  const dateLocale = language === 'pt-BR' ? 'pt-BR' : 'en-US';
  
  return new Intl.DateTimeFormat(dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}
