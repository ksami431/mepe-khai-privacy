import { useTheme } from '@/contexts/ThemeContext';

export const useThemedStyles = () => {
  const { theme } = useTheme();
  return theme;
};
