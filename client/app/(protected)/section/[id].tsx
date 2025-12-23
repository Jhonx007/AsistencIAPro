import { ActivityIndicator, FlatList, Text, View } from "react-native";
import {
  Stack,
  useLocalSearchParams,
  router,
  useFocusEffect,
} from "expo-router";
import CustomButton from "@/components/CustomButton";
import { useEffect, useState, useCallback } from "react";
import { getReportPrevious } from "@/services/subject.service";
import { Report } from "@/types/type";
import CardReport from "@/components/CardReport";
import EmptyState from "@/components/EmptyState";
import DropdownMenu from "@/components/DropdownMenu";
import { IconUsers } from "@/components/Icons";

function Details() {
  const { id, materia, seccion } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getReportPrevious({ id: id as string });
      setReports(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh when screen comes into focus (after returning from attendance)
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleGenerateAttendance = () => {
    // TODO: Navigate to attendance creation screen
    // For now, let's just refresh the list
    // In the future, you would navigate to an attendance screen like:
    // router.push(`/attendance/create?claseId=${id}&materia=${materia}&seccion=${seccion}`);

    // Temporary: just refresh to show new attendance if it was created
    fetchData();
  };

  return (
    <View className="flex-1 bg-gray-900 px-3 pb-5 ">
      <Stack.Screen
        options={{
          title: materia ? `${materia} - ${seccion}` : "Detalles de Materia",
          headerRight: () => (
            <DropdownMenu
              items={[
                {
                  label: "Lista de estudiantes",
                  icon: <IconUsers />,
                  onPress: () =>
                    router.push(
                      `/section/${id}/students?materia=${encodeURIComponent(
                        materia as string
                      )}&seccion=${encodeURIComponent(seccion as string)}`
                    ),
                },
              ]}
            />
          ),
        }}
      />

      {loading ? (
        <View className="flex-1">
          <Text className="text-3xl font-bold text-white mb-6 mt-5">
            Asistencias Previas
          </Text>
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text className="text-white text-lg mt-2">
              Cargando asistencias...
            </Text>
          </View>
        </View>
      ) : reports.length === 0 ? (
        <View className="flex-1">
          <Text className="text-3xl font-bold text-white mb-6 mt-5">
            Asistencias Previas
          </Text>
          <EmptyState
            title="No hay asistencias previas"
            description="Crea una asistencia para comenzar a registrar tus asistencias."
          />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text className="text-3xl font-bold text-white mb-6 mt-5">
              Asistencias Previas
            </Text>
          )}
          data={reports}
          renderItem={({ item }) => <CardReport report={item} />}
        />
      )}

      <CustomButton
        title="Generar Nueva Asistencia"
        onPress={handleGenerateAttendance}
      />
    </View>
  );
}

export default Details;
