import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useTheme';
import { CustomThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <CustomThemeProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(home)" />
            <Stack.Screen name="register" />
            <Stack.Screen name="login" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </CustomThemeProvider>
    </AuthProvider>
  );
}
