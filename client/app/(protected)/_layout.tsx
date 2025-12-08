import { Tabs } from "expo-router";

export default function ProtectedLayout() {
  return <Tabs screenOptions={{ headerShown: false }} />;
}
