import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getStudentsByClass } from "@/services/subject.service";
import { Registration } from "@/types/type";
import { formatDate } from "@/utils/date";
import CustomButton from "@/components/CustomButton";

export default function AttendanceSummary() {
  const router = useRouter();
  const { id, materia, seccion, presentes } = useLocalSearchParams<{
    id: string;
    materia: string;
    seccion: string;
    presentes: string; // IDs de estudiantes presentes separados por coma o JSON
  }>();

  const [activeFilter, setActiveFilter] = useState<
    "todos" | "presente" | "ausente"
  >("todos");

  // Parsear los IDs de presentes
  const presentesIds = useMemo(() => {
    try {
      if (!presentes) return [];
      return JSON.parse(presentes) as number[];
    } catch (e) {
      console.error("Error parseando presentes:", e);
      return [];
    }
  }, [presentes]);

  // Obtener lista completa de estudiantes
  const {
    data: studentsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["students", id],
    queryFn: async () => {
      const response = await getStudentsByClass({ id: id as string });
      return response.data;
    },
  });

  // Procesar estudiantes combinando con el estado de asistencia
  const processedStudents = useMemo(() => {
    if (!studentsData) return [];

    return studentsData
      .map((item: Registration) => {
        const studentId = item.estudiante.id;
        const isPresent = presentesIds.includes(studentId);

        return {
          ...item,
          status: isPresent ? "presente" : "ausente",
        };
      })
      .sort((a, b) => {
        // Ordenar: primero presentes
        if (a.status === b.status) return 0;
        return a.status === "presente" ? -1 : 1;
      });
  }, [studentsData, presentesIds]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = processedStudents.length;
    const presentCount = processedStudents.filter(
      (s) => s.status === "presente"
    ).length;
    const absentCount = total - presentCount;
    const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    return { total, presentCount, absentCount, percentage };
  }, [processedStudents]);

  // Filtrar según selección
  const students = useMemo(() => {
    if (activeFilter === "todos") return processedStudents;
    return processedStudents.filter((s) => s.status === activeFilter);
  }, [processedStudents, activeFilter]);

  const filters: { label: string; value: "todos" | "presente" | "ausente" }[] =
    [
      { label: "Todos", value: "todos" },
      { label: "Presentes", value: "presente" },
      { label: "Ausentes", value: "ausente" },
    ];

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <Stack.Screen
        options={{
          title: "Resumen de Asistencia",
        }}
      />

      <View className="mb-6">
        <Text className="text-gray-300 font-medium">
          {materia} - {seccion}
        </Text>
        <Text className="text-white text-2xl font-bold mt-1">
          {formatDate(new Date())}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 bg-gray-900 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-white mt-4">Cargando resumen...</Text>
        </View>
      ) : isError ? (
        <Text className="text-red-400 text-lg mt-2">Ha ocurrido un error</Text>
      ) : (
        <>
          {/* Tarjetas de Estadísticas */}
          <View className="flex-row gap-3 mb-6">
            {/* Presentes */}
            <View className="flex-1 bg-gray-800 p-4 rounded-xl border-l-4 border-green-500">
              <Text className="text-gray-400 text-xs uppercase font-bold">
                Presentes
              </Text>
              <View className="flex-row items-end mt-1">
                <Text className="text-white text-3xl font-bold">
                  {stats.presentCount}
                </Text>
                <Text className="text-gray-500 text-sm mb-1 ml-1">
                  / {stats.total}
                </Text>
              </View>
            </View>

            {/* Ausentes */}
            <View className="flex-1 bg-gray-800 p-4 rounded-xl border-l-4 border-red-500">
              <Text className="text-gray-400 text-xs uppercase font-bold">
                Ausentes
              </Text>
              <View className="flex-row items-end mt-1">
                <Text className="text-white text-3xl font-bold">
                  {stats.absentCount}
                </Text>
                <Text className="text-gray-500 text-sm mb-1 ml-1">
                  / {stats.total}
                </Text>
              </View>
            </View>

            {/* Porcentaje */}
            <View className="flex-1 bg-gray-800 p-4 rounded-xl border-l-4 border-blue-500 justify-center items-center">
              <Text className="text-blue-400 text-2xl font-bold">
                {stats.percentage}%
              </Text>
              <Text className="text-gray-400 text-[10px] text-center uppercase">
                Asistencia
              </Text>
            </View>
          </View>

          {/* Filtros */}
          <View className="flex-row mb-4 bg-gray-800 p-1 rounded-lg">
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                onPress={() => setActiveFilter(filter.value)}
                className={`flex-1 py-2 items-center rounded-md ${
                  activeFilter === filter.value ? "bg-sky-600" : ""
                }`}
              >
                <Text
                  className={`font-semibold capitalize ${
                    activeFilter === filter.value
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Lista de Estudiantes */}
          <FlatList
            data={students}
            keyExtractor={(item) => item.id_matricula.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View className="bg-gray-800 p-4 mb-3 rounded-xl border border-gray-700 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                      item.status === "presente"
                        ? "bg-green-500/20"
                        : "bg-red-500/20"
                    }`}
                  >
                    <Text
                      className={`font-bold ${item.status === "presente" ? "text-green-500" : "text-red-500"}`}
                    >
                      {item.estudiante.nombres.toUpperCase().charAt(0)}
                      {item.estudiante.apellidos.toUpperCase().charAt(0)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-white font-bold text-lg"
                      numberOfLines={1}
                    >
                      {item.estudiante.nombres} {item.estudiante.apellidos}
                    </Text>
                    <Text className="text-gray-400 font-medium">
                      {item.estudiante.cedula}
                    </Text>
                  </View>
                </View>

                <View
                  className={`px-3 py-1 rounded-full ${
                    item.status === "presente"
                      ? "bg-green-500/20"
                      : "bg-red-500/20"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold capitalize ${
                      item.status === "presente"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View className="py-10 items-center">
                <Text className="text-gray-500">
                  No hay estudiantes en esta categoría
                </Text>
              </View>
            }
          />

          <CustomButton
            title="Volver a Inicio"
            onPress={() => router.push("/(protected)/home")}
          />
        </>
      )}
    </View>
  );
}
