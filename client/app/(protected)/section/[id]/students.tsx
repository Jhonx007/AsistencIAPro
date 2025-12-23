import { FlatList, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getStudentsByClass } from "@/services/subject.service";
import { Registration } from "@/types/type";
import CardStudentRegister from "@/components/CardStudentRegister";

function Students() {
  const { id, materia, seccion } = useLocalSearchParams();
  const [students, setStudents] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await getStudentsByClass({ id: id as string });
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
        setLoading(false);
      }
    }
    fetchStudents();
  }, [id]);

  return (
    <View className="flex-1 bg-gray-900 px-3 pb-5">
      <Stack.Screen
        options={{
          title: materia ? `${materia} - ${seccion}` : "Lista de Estudiantes",
        }}
      />
      <Text className="text-3xl font-bold text-white mb-2 mt-5">
        Lista de Estudiantes
      </Text>
      <Text className="text-gray-400 mb-4">
        {students.length} estudiante{students.length !== 1 ? "s" : ""} •{" "}
        {students.filter((s) => s.estudiante.face_descriptor).length} con
        registro facial
      </Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id_matricula.toString()}
        renderItem={({ item }) => <CardStudentRegister item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

export default Students;
