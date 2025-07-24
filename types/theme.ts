export type ThemeColors =
  | 'blue'
  | 'green'
  | 'red'
  | 'amber'
  | 'purple'
  | 'sky'
  | 'indigo'
  | 'pink'
  | 'orange';

export type ThemeRadius = 0 | 0.5 | 0.75 | 1;

export type ThemeMode = 'light' | 'dark';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: (value: ThemeColors) => void;
  themeRadius: ThemeRadius;
  setThemeRadius: (value: ThemeRadius) => void;
}
