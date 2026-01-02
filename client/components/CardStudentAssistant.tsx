import { Text, View } from "react-native";
import { IconIdCardOutline } from "./Icons";
import { StudentAttendance } from "@/types/type";

export function CardStudentAssistant({
  estudiante,
}: {
  estudiante: StudentAttendance;
}) {
  return (
    <View
      key={estudiante.id}
      className="flex-row items-center bg-gray-700 rounded-xl p-3 border border-gray-600"
    >
      <View className="w-10 h-10 rounded-full bg-green-500/20 items-center justify-center mr-3 border border-green-500/30">
        <Text className="text-green-400 font-bold text-sm">
          {estudiante.nombres.toUpperCase().charAt(0)}
          {estudiante.apellidos.toUpperCase().charAt(0)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-white font-bold text-lg" numberOfLines={1}>
          {estudiante.nombres} {estudiante.apellidos}
        </Text>
        <View className="flex-row items-center mt-0.5">
          <IconIdCardOutline />
          <Text className="text-gray-400 font-medium ml-1">
            {estudiante.cedula}
          </Text>
        </View>
      </View>

      <View className="items-center bg-green-900/50 px-2 py-1 rounded-lg">
        <Text className="text-green-400 text-xs font-bold">
          {estudiante.hora}
        </Text>
        <Text className="text-green-400 text-[10px] uppercase font-bold mt-0.5">
          Presente
        </Text>
      </View>
    </View>
  );
}
