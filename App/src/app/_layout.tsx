import { useEffect } from 'react';
import { Stack, router } from 'expo-router';

export default function RootLayout() {
  const isAuthenticated = false; // Replace with your actual auth state hook

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  );
}