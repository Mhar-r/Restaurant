import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "../hooks/AuthContext"; // Asegúrate de tener useAuth

SplashScreen.preventAutoHideAsync();

function LayoutInner() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!user) {
      router.replace("/login"); // Redirige a login si no está autenticado
    }
  }, [user]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="login">
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="cashier" options={{ headerShown: false }} />
        <Stack.Screen name="client" options={{ headerShown: false }} />
        <Stack.Screen name="register-admin" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <LayoutInner />
    </AuthProvider>
  );
}
