import { getThemeColors } from '@/lib/content/loader';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeColors = getThemeColors();

  // Convert theme colors to CSS custom properties style object
  const themeStyle: React.CSSProperties = {};
  for (const [key, value] of Object.entries(themeColors)) {
    // Cast to allow CSS custom properties
    (themeStyle as Record<string, string>)[key] = value;
  }

  return (
    <div style={themeStyle}>
      {children}
    </div>
  );
}
