import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css"; // <- si global.css está en la raíz
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
