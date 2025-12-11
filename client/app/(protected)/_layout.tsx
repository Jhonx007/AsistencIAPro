import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedLayout() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <Stack
        screenOptions={{
          animation: "ios_from_right",
          headerStyle: {
            backgroundColor: "#111827",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="[id]"
          options={{
            title: "Detalle de Materia",
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
