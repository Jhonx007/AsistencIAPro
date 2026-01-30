import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getReportByDate } from "@/services/subject.service";
import EmptyState from "@/components/EmptyState";
import { formatDate } from "@/utils/date";
import { useMemo, useState } from "react";

export default function DetailsAttendance() {
  const { id, date, materia, seccion } = useLocalSearchParams();
  const [activeFilter, setActiveFilter] = useState<
    "todos" | "presente" | "ausente"
  >("todos");

  console.log("date", date);

  const { data, isLoading, error } = useQuery({
    queryKey: ["report-details", id, date],
    queryFn: () => getReportByDate({ id: id as string, date: date as string }),
    select: (data) => data.data,
  });

  const presentStudents = (data?.detalles.presentes ?? []).map((item) => ({
    ...item,
    status: "presente" as const,
  }));
  const absentStudents = (data?.detalles.ausentes ?? []).map((item) => ({
    ...item,
    status: "ausente" as const,
  }));

  const stats = useMemo(() => {
    const total = presentStudents.length + absentStudents.length;
    const percentage =
      total > 0 ? Math.round((presentStudents.length / total) * 100) : 0;

    return { total, percentage };
  }, [presentStudents, absentStudents]);

  const students = useMemo(() => {
    const processedStudents = [...presentStudents, ...absentStudents];
    if (activeFilter === "todos") return processedStudents;
    return processedStudents.filter((s) => s.status === activeFilter);
  }, [presentStudents, absentStudents, activeFilter]);

  const filters: {
    label: string;
    value: "todos" | "presente" | "ausente";
  }[] = [
    { label: "Todos", value: "todos" },
    { label: "Presentes", value: "presente" },
    { label: "Ausentes", value: "ausente" },
  ];

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <Stack.Screen
        options={{
          title: "Detalles de Asistencia",
        }}
      />

      <FlatList
        data={students}
        keyExtractor={(item) => item.estudiante.id.toString()}
        ListHeaderComponent={() => (
          <View className="gap-5">
            <View>
              <Text className="text-gray-300 font-medium">
                {materia} - {seccion}
              </Text>
              <Text className="text-white text-2xl font-bold mt-1">
                {formatDate(date as string)}
              </Text>
            </View>
            <View className="flex-row gap-3">
              {/* Presentes */}
              <View className="flex-1 bg-gray-800 p-4 rounded-xl border-l-4 border-green-500">
                <Text className="text-gray-400 text-xs uppercase font-bold">
                  Presentes
                </Text>
                <View className="flex-row items-end mt-1">
                  <Text className="text-white text-3xl font-bold">
                    {presentStudents.length}
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
                    {absentStudents.length}
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
            <View className="flex-row bg-gray-800 p-1 rounded-lg">
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
            <Text className="text-xl font-bold text-gray-400 mb-3">
              Lista de Estudiantes
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="bg-gray-800 p-4 mb-3 rounded-xl border border-gray-700 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              {/* Avatar con iniciales */}
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  item.status === "presente"
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}
              >
                <Text
                  className={`font-bold ${
                    item.status === "presente"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.estudiante.nombres.charAt(0).toUpperCase()}
                  {item.estudiante.apellidos.charAt(0).toUpperCase()}
                </Text>
              </View>

              {/* Info del estudiante */}
              <View className="flex-1">
                <Text
                  className="text-white font-bold text-lg"
                  numberOfLines={1}
                >
                  {item.estudiante.nombres} {item.estudiante.apellidos}
                </Text>
                <Text className="text-gray-400">{item.estudiante.cedula}</Text>
              </View>
            </View>

            {/* Badge de estado */}
            <View
              className={`px-3 py-1 rounded-full ${
                item.status === "presente" ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <Text
                className={`text-sm font-bold capitalize ${
                  item.status === "presente" ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.status}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            {isLoading ? (
              <ActivityIndicator size="large" color="#3b82f6" />
            ) : error ? (
              <EmptyState
                title="Error al cargar estudiantes"
                description="No se pudieron cargar los estudiantes."
              />
            ) : (
              <EmptyState
                title="No hay estudiantes"
                description="No hay estudiantes registrados en esta asistencia."
              />
            )}
          </View>
        )}
      />
    </View>
  );
}
