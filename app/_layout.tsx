import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, Suspense } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { migrate } from '@/hooks/useDb';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Suspense>
        <SQLiteProvider
          databaseName='db.db'
          onInit={migrate}
          options={{
            useNewConnection: true,
            //enableChangeListener: true,
          }}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SQLiteProvider >
      </Suspense>
    </ThemeProvider>
  );
}
