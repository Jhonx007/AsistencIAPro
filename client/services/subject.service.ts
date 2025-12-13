import axiosInstance from "@/utils/axios";
import { ReportApiResponse, SubjectsApiResponse } from "@/types/type";

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

export async function getReportPrevious({
  id,
}: {
  id: string;
}): Promise<ReportApiResponse> {
  try {
    const response = await axiosInstance.get<ReportApiResponse>(
      `/reportes/clase/${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createMateria(name: string) {
  try {
    const response = await axiosInstance.post("/materias", { name });
    return response.data;
  } catch (error) {
    console.error("Error al crear materia:", error);
    throw error;
  }
}

export async function createSeccion(codigo: string, semestre: string) {
  try {
    const response = await axiosInstance.post("/secciones", {
      codigo,
      semestre,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear sección:", error);
    throw error;
  }
}

export async function createClase(materiaId: number, seccionId: number) {
  try {
    const response = await axiosInstance.post("/clases/assign", {
      materiaId,
      seccionId,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear clase:", error);
    throw error;
  }
}
