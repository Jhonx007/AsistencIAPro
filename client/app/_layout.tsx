import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css"; // <- si global.css está en la raíz

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
