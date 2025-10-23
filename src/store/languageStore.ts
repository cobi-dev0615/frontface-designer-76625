import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'pt-BR' | 'en'; // Portuguese (Brazil) is the primary language

export interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'pt-BR', // Default to Brazilian Portuguese for Brazilian users
      setLanguage: (language: Language) => set({ language }),
      toggleLanguage: () => {
        const currentLanguage = get().language;
        set({ language: currentLanguage === 'pt-BR' ? 'en' : 'pt-BR' });
      },
    }),
    {
      name: 'duxfit-language-storage',
    }
  )
);
