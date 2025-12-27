import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import {
  IconAlert,
  IconCamera,
  IconCheck,
  IconFace,
  IconProfile,
} from "./Icons";
import { Registration } from "@/types/type";

function CardStudentRegister({
  item,
  classId,
}: {
  item: Registration;
  classId: string;
}) {
  const router = useRouter();
  const isRegistered = item.estudiante.face_descriptor ? true : false;
  const fullName = `${item.estudiante.nombres} ${item.estudiante.apellidos}`;

  const handleRegisterFace = () => {
    router.push({
      pathname: "/(protected)/register-face/[studentId]",
      params: {
        studentId: item.estudiante.id.toString(),
        studentName: fullName,
        studentIdentity: item.estudiante.cedula,
        classId,
      },
    });
  };

  return (
    <View className="flex-row items-center gap-4 p-4 bg-gray-800/75 rounded-2xl mb-3">
      {/* Avatar */}
      <View className="bg-gray-700/60 p-4 rounded-full">
        <IconProfile />
      </View>

      {/* Info del estudiante */}
      <View className="flex-1">
        <Text className="text-white font-bold text-lg" numberOfLines={1}>
          {fullName}
        </Text>
        <Text className="text-gray-400 text-sm font-medium">
          C.I: {item.estudiante.cedula}
        </Text>

        {/* Badge de estado de registro */}
        <View className="flex-row items-center mt-2">
          {isRegistered ? (
            <View className="flex-row items-center bg-green-900/50 px-3 py-1 rounded-full">
              <IconCheck />
              <Text className="text-green-400 text-xs ml-1 font-medium">
                Rostro registrado
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center bg-amber-900/40 px-3 py-1 rounded-full">
              <IconAlert />
              <Text className="text-amber-400 text-xs ml-1 font-medium">
                Sin registro facial
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Botón de acción */}
      {!isRegistered && (
        <TouchableOpacity
          onPress={handleRegisterFace}
          className="bg-blue-500/70 p-3 rounded-xl"
        >
          <IconCamera />
        </TouchableOpacity>
      )}

      {isRegistered && (
        <View className="bg-green-600/20 p-3 rounded-xl">
          <IconFace />
        </View>
      )}
    </View>
  );
}

export default CardStudentRegister;
