import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Default to dark mode (current mode)
      setTheme: (theme: Theme) => set({ theme }),
      toggleTheme: () => {
        const currentTheme = get().theme;
        set({ theme: currentTheme === 'dark' ? 'light' : 'dark' });
      },
      get isDark() {
        return get().theme === 'dark';
      },
      get isLight() {
        return get().theme === 'light';
      },
    }),
    {
      name: 'duxfit-theme-storage',
    }
  )
);
