import { View, Text } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/CustomButton";
import Feather from "@expo/vector-icons/Feather";

export default function SuccessEnrollment() {
  const { totalStudents, materia, seccion } = useLocalSearchParams<{
    totalStudents: string;
    materia: string;
    seccion: string;
  }>();

  const handleRegisterFaces = () => {
    // TODO: Navigate to face registration flow
    router.replace("/home");
  };

  const handleGoToCourses = () => {
    router.replace("/home");
  };

  return (
    <View className="flex-1 bg-gray-900 px-5">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-1 justify-center items-center">
        {/* Success Icon */}
        <View className="relative mb-8">
          <View className="absolute w-48 h-48 bg-green-900 opacity-20 rounded-full" />
          <View className="absolute inset-0 w-48 h-48 bg-green-800 opacity-30 rounded-full scale-75" />
          <View className="w-48 h-48 bg-green-700 opacity-40 rounded-full scale-50 items-center justify-center">
            <View className="bg-green-500 w-24 h-24 rounded-full items-center justify-center">
              <Feather name="check" size={48} color="white" />
            </View>
          </View>
        </View>

        {/* Success Message */}
        <Text className="text-white text-3xl font-bold text-center mb-3">
          ¡Estudiantes Agregados!
        </Text>

        <Text className="text-gray-400 text-center text-base mb-8 px-8">
          Los estudiantes se han agregado correctamente a la materia. Ya puedes
          comenzar a tomar asistencia.
        </Text>

        {/* Summary Card */}
        <View className="bg-zinc-800 rounded-2xl p-6 w-full mb-8">
          <View className="flex-row items-center mb-4">
            <View className="bg-sky-600 w-12 h-12 rounded-full items-center justify-center mr-4">
              <Feather name="users" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 text-sm">Resumen</Text>
              <Text className="text-white text-xl font-bold">
                {totalStudents} Nuevos inscritos
              </Text>
            </View>
          </View>

          <View className="border-t border-gray-700 pt-4">
            <Text className="text-gray-400 text-sm mb-1">Materia</Text>
            <Text className="text-white text-base font-semibold mb-3">
              {materia}
            </Text>
            <Text className="text-gray-400 text-sm mb-1">Sección</Text>
            <Text className="text-white text-base font-semibold">
              {seccion}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="w-full gap-3">
          <CustomButton
            title="🔍 Registrar Rostros de Estudiantes"
            onPress={handleRegisterFaces}
          />

          <CustomButton
            title="Ir a Mis Cursos"
            onPress={handleGoToCourses}
            buttonStyles="bg-transparent border-2 border-sky-500"
          />
        </View>
      </View>
    </View>
  );
}
