import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { getReportPrevious } from "@/services/subject.service";
import CardReport from "@/components/CardReport";
import EmptyState from "@/components/EmptyState";
import DropdownMenu from "@/components/DropdownMenu";
import { IconUsers } from "@/components/Icons";
import { useQuery } from "@tanstack/react-query";

function Details() {
  const { id, materia, seccion } = useLocalSearchParams();
  const {
    data: reports,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["reports", id],
    queryFn: () => getReportPrevious({ id: id as string }),
    select: (data) => data.data,
  });

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

      {isLoading ? (
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
      ) : isError ? (
        <View>
          <Text className="text-3xl font-bold text-white mb-6 mt-5">
            Asistencias Previas
          </Text>
          <Text className="text-red-400 text-lg mt-2">
            Ha ocurrido un error
          </Text>
        </View>
      ) : reports?.length === 0 ? (
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
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={["#0284c7"]}
              progressBackgroundColor="#030712"
            />
          }
          data={reports}
          renderItem={({ item }) => <CardReport report={item} />}
        />
      )}

      <CustomButton title="Generar Nueva Asistencia" />
    </View>
  );
}

export default Details;
