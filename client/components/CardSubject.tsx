import { Text, TouchableOpacity, View } from "react-native";
import { IconBook, IconRigthArrow, IconDownArrow } from "./Icons";
import { useState } from "react";
import { router } from "expo-router";
import { Subject } from "@/types/type";

export function CardSubject({ name, secciones }: Subject) {
  const [deployed, setDeployed] = useState(false);

  const toggleDeploy = () => {
    setDeployed(!deployed);
  };

  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={toggleDeploy}
        activeOpacity={0.7}
        className={`relative flex-row items-center gap-4 bg-gray-800/75 p-5 ${deployed ? "rounded-t-2xl" : "rounded-2xl"}`}
      >
        <View className="bg-sky-800/50 p-4 rounded-xl">
          <IconBook />
        </View>
        <View className="flex-1">
          <Text className="text-white text-2xl font-semibold">{name}</Text>
        </View>
        <View>{deployed ? <IconDownArrow /> : <IconRigthArrow />}</View>
      </TouchableOpacity>
      {deployed && (
        <View className="bg-gray-800/75 rounded-b-xl">
          {secciones.map((seccion) => (
            <TouchableOpacity
              onPress={() => {
                router.push(
                  `/section/${seccion.clase_id}?materia=${encodeURIComponent(name)}&seccion=${encodeURIComponent(seccion.codigo)}`
                );
              }}
              key={seccion.seccion_id}
              className={`p-5 border-t border-gray-700`}
            >
              <Text className="text-white text-xl">
                Sección {seccion.codigo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
