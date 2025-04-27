// app/index.tsx
import { Stack } from 'expo-router';

export default function Index() {
  return (
    <Stack>
      {/* Aquí defines las rutas principales de tu aplicación */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="cashier" options={{ headerShown: false }} />
      <Stack.Screen name="client" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

