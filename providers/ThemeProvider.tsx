import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'github' | 'notion-light' | 'notion-dark' | 'apple-light' | 'apple-dark';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme === 'dark' ? 'github' : 'notion-light');

  useEffect(() => {
    if (systemColorScheme) {
      setTheme(systemColorScheme === 'dark' ? 'github' : 'notion-light');
    }
  }, [systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme.includes('dark'), setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Theme configuration
export const colors = {
  light: {
    background: '#F1F5F9',
    text: '#1F2937',
    primary: '#4F46E5',
    secondary: '#6B7280',
    border: '#E2E8F0',
    error: '#EF4444',
    card: '#FFFFFF',
    tabBar: '#FFFFFF',
    shade1: '#FFFFFF',
    shade2: '#F8FAFC',
    shade3: '#F1F5F9',
  },
  dark: {
    background: '#1F2937',
    text: '#F3F4F6',
    primary: '#818CF8',
    secondary: '#9CA3AF',
    border: '#374151',
    error: '#F87171',
    card: '#111827',
    tabBar: '#111827',
    shade1: '#111827',
    shade2: '#1F2937',
    shade3: '#374151',
  },
  github: {
    background: '#0D1117',
    text: '#C9D1D9',
    primary: '#58A6FF',
    secondary: '#8B949E',
    border: '#30363D',
    error: '#F85149',
    card: '#161B22',
    tabBar: '#161B22',
    shade1: '#161B22',
    shade2: '#21262D',
    shade3: '#30363D',
  },
  'notion-light': {
    background: '#EBECED',
    text: '#37352F',
    primary: '#2383E2',
    secondary: '#787774',
    border: '#E9E9E8',
    error: '#EB5757',
    card: '#FFFFFF',
    tabBar: '#FFFFFF',
    shade1: '#FFFFFF',
    shade2: '#F7F7F7',
    shade3: '#EBECED',
  },
  'notion-dark': {
    background: '#191919',
    text: '#FFFFFF',
    primary: '#2383E2',
    secondary: '#999999',
    border: '#363636',
    error: '#EB5757',
    card: '#2F2F2F',
    tabBar: '#2F2F2F',
    shade1: '#2F2F2F',
    shade2: '#363636',
    shade3: '#404040',
  },
  'apple-light': {
    background: '#F2F2F7',
    text: '#000000',
    primary: '#007AFF',
    secondary: '#8E8E93',
    border: '#C6C6C8',
    error: '#FF3B30',
    card: '#FFFFFF',
    tabBar: '#FFFFFF',
    shade1: '#FFFFFF',
    shade2: '#F2F2F7',
    shade3: '#E5E5EA',
  },
  'apple-dark': {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#0A84FF',
    secondary: '#98989D',
    border: '#38383A',
    error: '#FF453A',
    card: '#1C1C1E',
    tabBar: '#1C1C1E',
    shade1: '#1C1C1E',
    shade2: '#2C2C2E',
    shade3: '#3A3A3C',
  },
};