import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1565C0', // YCCE Blue
    primaryContainer: '#BBDEFB',
    secondary: '#FFA726', // Orange accent
    secondaryContainer: '#FFE0B2',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#0D47A1',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#E65100',
    onSurface: '#1A1C1E',
    onSurfaceVariant: '#44474E',
    onError: '#FFFFFF',
    onErrorContainer: '#B71C1C',
    outline: '#75777F',
    outlineVariant: '#C4C6CF',
    inverseSurface: '#2F3033',
    inverseOnSurface: '#F0F0F3',
    inversePrimary: '#90CAF9',
    elevation: {
      level0: 'transparent',
      level1: '#F7F7F7',
      level2: '#F0F0F0',
      level3: '#E8E8E8',
      level4: '#E0E0E0',
      level5: '#D8D8D8',
    },
    shadow: '#000000',
    scrim: '#000000',
  },
  fonts: {
    ...DefaultTheme.fonts,
    bodyLarge: {
      ...DefaultTheme.fonts.bodyLarge,
      fontSize: 16,
      fontWeight: '400' as const,
    },
    bodyMedium: {
      ...DefaultTheme.fonts.bodyMedium,
      fontSize: 14,
      fontWeight: '400' as const,
    },
    titleLarge: {
      ...DefaultTheme.fonts.titleLarge,
      fontSize: 22,
      fontWeight: '600' as const,
    },
    titleMedium: {
      ...DefaultTheme.fonts.titleMedium,
      fontSize: 18,
      fontWeight: '500' as const,
    },
  },
};