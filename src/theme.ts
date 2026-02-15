// ParkSpot Theme - Clean, Direct, Navigation-Focused
// Blue brand for trust and navigation

export const colors = {
  // Brand Colors
  primary: '#0066FF',      // Vibrant navigation blue
  primaryLight: '#3385FF',
  primaryDark: '#0052CC',
  
  // Accent
  accent: '#00D4FF',      // Cyan highlight
  accentSecondary: '#E6F0FF',
  
  // Neutrals
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F5',
  
  // Text
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#9B9B9B',
  
  // Status
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // UI Elements
  border: '#E5E5E5',
  divider: '#F0F0F0',
  
  // Tab Bar
  tabActive: '#0066FF',
  tabInactive: '#9B9B9B',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  caption: 13,
  body: 17,
  subtitle: 20,
  title: 28,
  largeTitle: 34,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
