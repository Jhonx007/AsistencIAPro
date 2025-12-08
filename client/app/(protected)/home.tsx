import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

function Home() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="px-4 py-6">
        <Text className="text-3xl font-bold text-white mb-6">
          Bienvenido, Profesor
        </Text>

        {user && (
          <View className="bg-gray-800 p-4 rounded-lg mb-6">
            <Text className="text-xl font-semibold text-sky-500 mb-3">
              Información del Profesor
            </Text>
            <View className="gap-2">
              <Text className="text-white text-lg">
                <Text className="font-semibold">Nombres:</Text> {user.nombres}
              </Text>
              <Text className="text-white text-lg">
                <Text className="font-semibold">Apellidos:</Text>{" "}
                {user.apellidos}
              </Text>
              <Text className="text-white text-lg">
                <Text className="font-semibold">Cédula:</Text> {user.cedula}
              </Text>
              {user.telefono && (
                <Text className="text-white text-lg">
                  <Text className="font-semibold">Teléfono:</Text>{" "}
                  {user.telefono}
                </Text>
              )}
              <Text className="text-gray-400 text-sm mt-2">
                <Text className="font-semibold">ID:</Text> {user.id}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          className="bg-red-600 p-4 rounded-lg"
          onPress={logout}
        >
          <Text className="text-center text-white text-lg font-semibold">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;
