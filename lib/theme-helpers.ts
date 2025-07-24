import {
  ThemeColors,
  ThemeRadius,
  ThemeMode,
} from '@/types/theme';

export function getSavedThemeColor(): ThemeColors {
  if (typeof window !== 'undefined') {
    return (
      (localStorage.getItem('themeColor') as ThemeColors) ||
      'blue'
    );
  }
  return 'blue';
}

export function getSavedThemeRadius(): ThemeRadius {
  if (typeof window !== 'undefined') {
    return (
      (Number(
        localStorage.getItem('themeRadius')
      ) as ThemeRadius) || 0.5
    );
  }
  return 0.5;
}

export function setGlobalColorTheme(
  mode: ThemeMode,
  color: ThemeColors,
  radius: ThemeRadius
) {
  const root = document.documentElement;

  // Set CSS variables or classes for color themes
  root.setAttribute('data-theme-color', color);
  root.style.setProperty('--radius', `${radius}rem`);

  // You can define these in Tailwind config or CSS:
  // --primary, --accent, etc.
}
