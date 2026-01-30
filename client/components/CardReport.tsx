import { Report } from "@/types/type";
import { Text, View, TouchableOpacity } from "react-native";
import { IconFile } from "./Icons";
import { formatDate, formatDateForApi } from "@/utils/date";
import { router } from "expo-router";

function CardReport({
  report,
  materia,
  seccion,
}: {
  report: Report;
  materia: string;
  seccion: string;
}) {
  console.log(JSON.stringify(report, null, 2));

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(
          `/section/${report.id_clase}/details-attendance?materia=${materia}&seccion=${seccion}&date=${formatDateForApi(
            report.fecha,
          )}`,
        );
      }}
    >
      <View className="flex-row items-center gap-4 p-5 bg-gray-800/75 rounded-2xl mb-4">
        <View className="bg-gray-700/60 p-4 rounded-xl">
          <IconFile />
        </View>
        <View className="flex-1">
          <Text className="text-2xl text-white font-semibold mb-2">
            {formatDate(report.fecha)}
          </Text>
          <View className="flex-row gap-5">
            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-2">
                <View className="bg-blue-500 rounded-full size-3" />
                <Text className="text-white font-bold text-lg">
                  {report.total_presentes}
                </Text>
              </View>
              <Text className="text-gray-400">Presentes</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-2">
                <View className="bg-red-500 rounded-full size-3" />
                <Text className="text-white font-bold text-lg">
                  {report.total_ausentes}
                </Text>
              </View>
              <Text className="text-gray-400">Ausentes</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CardReport;
