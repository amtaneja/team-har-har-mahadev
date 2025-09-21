import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEME_MODES, type ThemeModeType } from '../constant';
import { applyThemeToDocument } from '../utils';

export interface ThemeStore {
  // State
  themeMode: ThemeModeType;
  
  // Actions
  setTheme: (themeMode: ThemeModeType) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

const initialState = {
  themeMode: THEME_MODES.LIGHT,
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setTheme: (themeMode: ThemeModeType) => {
        set({ themeMode });
        applyThemeToDocument(themeMode);
      },
      
      toggleTheme: () => {
        const { themeMode } = get();
        const newTheme = themeMode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
        set({ themeMode: newTheme });
        applyThemeToDocument(newTheme);
      },
      
      initializeTheme: () => {
        const { themeMode } = get();
        applyThemeToDocument(themeMode);
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    }
  )
);
