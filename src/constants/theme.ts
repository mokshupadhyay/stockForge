export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F8FAFC',
  card: '#FFFFFF',
  text: {
    primary: '#1E293B',
    secondary: '#475569',
    tertiary: '#94A3B8',
  },
  accent: '#00D09C',
  success: '#10D07A',
  error: '#EF4444',
  warning: '#FFB800',
  border: '#E2E8F0',
  shadow: '#000000',
  // Additional colors for better dark mode support
  surfaceSecondary: '#F1F5F9',
  backgroundSecondary: '#F9FAFB',
  textInverse: '#FFFFFF',
  cardBorder: '#F3F4F6',
};

export const darkTheme = {
  background: '#0D1117', // Dark black like Groww
  surface: '#161B22', // Slightly lighter surface
  card: '#21262D', // Card background
  text: {
    primary: '#F0F6FC', // High contrast white
    secondary: '#8B949E', // Medium gray
    tertiary: '#6E7681', // Light gray
  },
  accent: '#00D09C', // Groww green
  success: '#238636', // Dark green
  error: '#F85149', // Red for dark theme
  warning: '#D29922', // Orange for dark theme
  border: '#30363D', // Dark border
  shadow: '#000000',
  // Additional colors for better dark mode support
  surfaceSecondary: '#21262D',
  backgroundSecondary: '#0D1117',
  textInverse: '#0D1117',
  cardBorder: '#30363D',
};

export type Theme = typeof lightTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography = {
  headline: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500' as const,
  },
};
