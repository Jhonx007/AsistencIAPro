import { Report } from "@/types/type";
import { Text, View } from "react-native";
import { IconFile } from "./Icons";
import { formatDate } from "@/utils/date";

function CardReport({ report }: { report: Report }) {
  return (
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
  );
}

export default CardReport;
