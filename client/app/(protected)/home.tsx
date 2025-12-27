import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { getSubjects } from "@/services/subject.service";
import { CardSubject } from "@/components/CardSubject";
import { Subject, SubjectData } from "@/types/type";
import { Stack, router } from "expo-router";
import { IconLogout } from "@/components/Icons";
import EmptyState from "@/components/EmptyState";
import { useQuery } from "@tanstack/react-query";

function Home() {
  const { user, logout } = useAuth();
  const {
    data: sections,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => fetchSubjects(),
  });

  async function fetchSubjects() {
    try {
      const response = await getSubjects();
      const subjectsArray = Object.entries(response.data).map(
        ([name, data]: [string, SubjectData]): Subject => ({
          name,
          secciones: data.secciones,
        })
      );
      return subjectsArray;
    } catch (e) {
      throw e;
    }
  }

  return (
    <View className="flex-1 bg-gray-900 px-3">
      <Stack.Screen
        options={{
          headerTitle: "Mis Materias",
          headerRight: () => (
            <TouchableOpacity onPress={logout}>
              <IconLogout />
            </TouchableOpacity>
          ),
        }}
      />
      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-sky-600 size-16 rounded-full items-center justify-center shadow-lg z-10"
        onPress={() => {
          router.push("/create-subject");
        }}
      >
        <Text className="text-white text-4xl">+</Text>
      </TouchableOpacity>

      {isLoading ? (
        <View className="flex-1">
          <Text className="text-3xl font-bold text-white mb-6 mt-5">
            Bienvenido, Prof. {user?.nombres}
          </Text>
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text className="text-white text-lg mt-2">
              Cargando materias...
            </Text>
          </View>
        </View>
      ) : isError ? (
        <View className="flex-1">
          <Text className="text-3xl font-bold text-white mb-6 mt-5">
            Bienvenido, Prof. {user?.nombres}
          </Text>
          <Text className="text-red-400 text-lg mt-2">
            Ha ocurrido un error
          </Text>
        </View>
      ) : sections?.length === 0 ? (
        <View className="flex-1">
          <Text className="text-3xl font-bold text-white mb-8 mt-5">
            Bienvenido, Prof. {user?.nombres}
          </Text>
          <EmptyState
            title="No hay materias creadas"
            description="Crea una materia para comenzar a registrar tus clases."
          />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text className="text-3xl font-bold text-white mb-6 mt-5">
              Bienvenido, Prof. {user?.nombres}
            </Text>
          )}
          data={sections}
          keyExtractor={(item) => item.name}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={["#0284c7"]}
              progressBackgroundColor="#030712"
            />
          }
          renderItem={({ item }) => (
            <CardSubject name={item.name} secciones={item.secciones} />
          )}
        />
      )}
    </View>
  );
}

export default Home;
