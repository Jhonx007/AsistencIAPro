import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { getStudentsByClass } from "@/services/subject.service";
import CardStudentRegister from "@/components/CardStudentRegister";
import EmptyState from "@/components/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { Registration } from "@/types/type";

function Students() {
  const { id, materia, seccion } = useLocalSearchParams();
  const {
    data: students = [],
    isLoading: loading,
    refetch,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: ["students", id],
    queryFn: async () => {
      const response = await getStudentsByClass({ id: id as string });
      return response.data;
    },
  });

  return (
    <View className="flex-1 bg-gray-900 px-3 pb-5">
      <Stack.Screen
        options={{
          title: materia ? `${materia} - ${seccion}` : "Lista de Estudiantes",
        }}
      />
      {loading ? (
        <View className="flex-1">
          <Text className="text-3xl font-bold text-white mb-6 mt-5">
            Lista de Estudiantes
          </Text>
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text className="text-white text-lg mt-2">
              Cargando estudiantes...
            </Text>
          </View>
        </View>
      ) : isError ? (
        <View>
          <Text className="text-3xl font-bold text-white mb-6 mt-5">
            Lista de Estudiantes
          </Text>
          <Text className="text-red-400 text-lg mt-2">
            Ha ocurrido un error
          </Text>
        </View>
      ) : students.length === 0 ? (
        <View className="flex-1">
          <Text className="text-3xl font-bold text-white mb-6 mt-5">
            Lista de Estudiantes
          </Text>
          <EmptyState
            title="No hay estudiantes"
            description="Crea un estudiante para comenzar a registrar tus asistencias."
          />
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id_matricula.toString()}
          renderItem={({ item }) => (
            <CardStudentRegister item={item} classId={id as string} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={["#0284c7"]}
              progressBackgroundColor="#030712"
            />
          }
          ListHeaderComponent={() => (
            <>
              <Text className="text-3xl font-bold text-white mb-3 mt-5">
                Lista de Estudiantes
              </Text>
              <Text className="text-gray-400 mb-4">
                {students.length} estudiante{students.length !== 1 ? "s" : ""} •{" "}
                {
                  students.filter(
                    (s: Registration) => s.estudiante.face_descriptor
                  ).length
                }{" "}
                con registro facial
              </Text>
            </>
          )}
        />
      )}
    </View>
  );
}

export default Students;
