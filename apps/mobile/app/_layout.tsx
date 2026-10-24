import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/src/theme';

// Keep the splash up until app/index.tsx has seen the persisted onboarding state
// and hides it. Must run at module level, before the first render.
SplashScreen.preventAutoHideAsync().catch(() => {});

function Navigation() {
  const theme = useTheme();

  const navigationTheme = useMemo(() => {
    const base = theme.mode === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;
    return {
      ...base,
      dark: theme.mode === 'dark',
      colors: {
        ...base.colors,
        primary: theme.colors.accent,
        background: theme.colors.bg,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.colors.premium,
      },
    };
  }, [theme]);

  // The Stack must render on the first render (never null) so a Redirect can't
  // fire before the navigator is mounted.
  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="gallery" options={{ headerShown: true, title: 'Component gallery' }} />
      </Stack>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}
