'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useTheme } from 'next-themes';
import { useMounted } from '@/hooks/use-mounted';
import {
  ThemeColors,
  ThemeColorStateParams,
  ThemeProviderProps,
  ThemeRadius,
  ThemeMode,
} from '@/types/theme';
import {
  getSavedThemeColor,
  getSavedThemeRadius,
  setGlobalColorTheme,
} from '@/lib/theme-helpers';

const ThemeContext = createContext<ThemeColorStateParams>(
  {} as ThemeColorStateParams
);

export function ColorsThemeProvider({
  children,
}: ThemeProviderProps) {
  const isMounted = useMounted();
  const { resolvedTheme: theme } = useTheme();

  const [themeColor, setThemeColor] = useState<ThemeColors>(
    getSavedThemeColor()
  );
  const [themeRadius, setThemeRadius] =
    useState<ThemeRadius>(getSavedThemeRadius());

  useEffect(() => {
    if (!isMounted) return;
    setGlobalColorTheme(
      theme as ThemeMode,
      themeColor,
      themeRadius
    );
    localStorage.setItem('themeColor', themeColor);
    localStorage.setItem(
      'themeRadius',
      String(themeRadius)
    );
  }, [theme, themeColor, themeRadius, isMounted]);

  return (
    <ThemeContext.Provider
      value={{
        themeColor,
        setThemeColor,
        themeRadius,
        setThemeRadius,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeColor = () => useContext(ThemeContext);
