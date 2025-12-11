import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getSubjects } from "@/services/subject.service";
import { CardSubject } from "@/components/CardSubject";
import { Subject, SubjectData } from "@/types/type";
import { Stack } from "expo-router";
import { IconLogout } from "@/components/Icons";
import EmptyState from "@/components/EmptyState";

function Home() {
  const { user, logout } = useAuth();
  const [sections, setSections] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await getSubjects();
        const subjectsArray = Object.entries(response.data).map(
          ([name, data]: [string, SubjectData]): Subject => ({
            name,
            secciones: data.secciones,
          })
        );
        setSections(subjectsArray);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

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
          console.log("Crear nueva materia");
        }}
      >
        <Text className="text-white text-4xl">+</Text>
      </TouchableOpacity>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text className="text-white text-lg mt-2">Cargando materias...</Text>
        </View>
      ) : sections.length === 0 ? (
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
          renderItem={({ item }) => (
            <CardSubject name={item.name} secciones={item.secciones} />
          )}
        />
      )}
    </View>
  );
}

export default Home;
