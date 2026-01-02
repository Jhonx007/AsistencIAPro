import { View, Text, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { IconBook, IconCamera, IconList } from "@/components/Icons";

function AttendanceMethod() {
  const { id, materia, seccion } = useLocalSearchParams();

  const handleManualRegistration = () => {
    // TODO: Navegar a la vista de registro manual
    router.push(
      `/section/${id}/manual-attendance?materia=${encodeURIComponent(
        materia as string
      )}&seccion=${encodeURIComponent(seccion as string)}`
    );
  };

  const handleFacialRecognition = () => {
    // TODO: Navegar a la vista de reconocimiento facial
    router.push(
      `/section/${id}/facial-attendance?materia=${encodeURIComponent(
        materia as string
      )}&seccion=${encodeURIComponent(seccion as string)}`
    );
  };

  return (
    <View className="flex-1 bg-gray-900 px-4 py-6">
      <Stack.Screen
        options={{
          title: "Método de Asistencia",
        }}
      />

      <View className="flex-1 gap-6 mt-4">
        <View className="items-center gap-4">
          <View className="bg-sky-800/50 p-5 rounded-xl">
            <IconBook />
          </View>
          <View className="mb-6">
            <Text className="text-3xl font-bold text-white text-center mb-2">
              {materia ? `${materia} - ${seccion}` : "Método de Asistencia"}
            </Text>
            <Text className="text-gray-400 font-medium text-center text-lg">
              Selecciona el método que prefieras utilizar
            </Text>
          </View>
        </View>

        {/* Opción: Registro Manual */}
        <TouchableOpacity
          onPress={handleManualRegistration}
          className="w-full bg-gray-800/75 p-6 rounded-2xl shadow-lg"
          activeOpacity={0.8}
        >
          <View className="items-center">
            <View className="bg-white/20 w-16 h-16 rounded-full items-center justify-center mb-4">
              <IconList />
            </View>
            <Text className="text-white text-xl font-bold mb-2">
              Registro Manual
            </Text>
            <Text className="text-white/80 text-center">
              Marca la asistencia de cada estudiante de forma manual
            </Text>
          </View>
        </TouchableOpacity>

        {/* Opción: Reconocimiento Facial */}
        <TouchableOpacity
          onPress={handleFacialRecognition}
          className="w-full bg-gray-800/75 p-6 rounded-2xl shadow-lg"
          activeOpacity={0.8}
        >
          <View className="items-center">
            <View className="bg-white/20 w-16 h-16 rounded-full items-center justify-center mb-4">
              <IconCamera />
            </View>
            <Text className="text-white text-xl font-bold mb-2">
              Reconocimiento Facial
            </Text>
            <Text className="text-white/80 text-center ">
              Usa la cámara para identificar estudiantes automáticamente
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AttendanceMethod;
