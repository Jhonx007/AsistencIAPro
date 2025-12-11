import axiosInstance from "@/utils/axios";
import { SubjectsApiResponse } from "@/types/type";

export async function getSubjects(): Promise<SubjectsApiResponse> {
  try {
    const response = await axiosInstance.get<SubjectsApiResponse>(
      "/clases/myclasses/grouped/"
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener las materias:", error);
    throw error;
  }
}
