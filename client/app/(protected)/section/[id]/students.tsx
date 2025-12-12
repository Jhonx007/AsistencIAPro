import { Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

function Students() {
  const { id, materia, seccion } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-gray-900 px-3 pb-5">
      <Stack.Screen
        options={{
          title: materia ? `${materia} - ${seccion}` : "Lista de Estudiantes",
        }}
      />
      <Text className="text-3xl font-bold text-white mb-6 mt-5">
        Lista de Estudiantes
      </Text>
    </View>
  );
}

export default Students;
