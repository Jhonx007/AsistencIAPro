import axiosInstance from "@/utils/axios";
import {
  ReportApiResponse,
  ReportDetailsAPIResponse,
  StudentsAPIResponse,
  SubjectsApiResponse,
} from "@/types/type";

// API Response Interfaces
export interface MateriaApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
  };
}

export interface SeccionApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    codigo: string;
    semestre: string;
  };
}

export interface ClaseApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    materiaId: number;
    seccionId: number;
    profesorId: string;
  };
}

// Create Materia
export async function createMateria(name: string): Promise<MateriaApiResponse> {
  try {
    const response = await axiosInstance.post<MateriaApiResponse>("/materias", {
      name,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Create Seccion
export async function createSeccion(
  codigo: string,
  semestre: string,
): Promise<SeccionApiResponse> {
  try {
    const response = await axiosInstance.post<SeccionApiResponse>(
      "/secciones",
      { codigo, semestre },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Create Clase (assign materia and seccion)
export async function createClase(
  materiaId: number,
  seccionId: number,
): Promise<ClaseApiResponse> {
  try {
    const response = await axiosInstance.post<ClaseApiResponse>(
      "/clases/assign",
      { materiaId, seccionId },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getSubjects(): Promise<SubjectsApiResponse> {
  try {
    const response = await axiosInstance.get<SubjectsApiResponse>(
      "/clases/myclasses/grouped/",
    );
    return response.data;
  } catch (error) {
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
      `/reportes/clase/${id}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getReportByDate({
  id,
  date,
}: {
  id: string;
  date: string;
}): Promise<ReportDetailsAPIResponse> {
  try {
    const response = await axiosInstance.get<ReportDetailsAPIResponse>(
      `/asistencia/clase/${id}/fecha/${date}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getStudentsByClass({
  id,
}: {
  id: string;
}): Promise<StudentsAPIResponse> {
  try {
    const response = await axiosInstance.get<StudentsAPIResponse>(
      `/clases/${id}/estudiantes`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
