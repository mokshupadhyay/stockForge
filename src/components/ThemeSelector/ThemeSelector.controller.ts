import { useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface UseThemeSelectorControllerProps {
  onClose: () => void;
}

export const useThemeSelectorController = ({
  onClose,
}: UseThemeSelectorControllerProps) => {
  const { theme, themeMode, setThemeMode } = useTheme();

  const themeOptions = [
    {
      key: 'system' as const,
      label: 'System Default',
      icon: 'smartphone',
      description: 'Follow device settings',
    },
    {
      key: 'light' as const,
      label: 'Light Mode',
      icon: 'light-mode',
      description: 'Always use light theme',
    },
    {
      key: 'dark' as const,
      label: 'Dark Mode',
      icon: 'dark-mode',
      description: 'Always use dark theme',
    },
  ];

  const handleThemeSelect = useCallback(
    (mode: 'light' | 'dark' | 'system') => {
      setThemeMode(mode);
      onClose();
    },
    [setThemeMode, onClose],
  );

  return {
    theme,
    themeMode,
    themeOptions,
    handleThemeSelect,
  };
};
