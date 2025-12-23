import axiosInstance from "@/utils/axios";

export interface CreateStudentData {
  nombres: string;
  apellidos: string;
  cedula: string;
}

export interface Student {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  created_at: string;
  updated_at: string;
}

export interface StudentsApiResponse {
  success: boolean;
  data: Student[];
}

export interface StudentApiResponse {
  success: boolean;
  data: Student;
  message?: string;
}

export interface EnrollmentResponse {
  success: boolean;
  data: any;
  message?: string;
}

export async function getStudents(): Promise<StudentsApiResponse> {
  try {
    const response =
      await axiosInstance.get<StudentsApiResponse>("/estudiantes");
    return response.data;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    throw error;
  }
}

export async function createStudent(
  data: CreateStudentData
): Promise<StudentApiResponse> {
  try {
    const response = await axiosInstance.post<StudentApiResponse>(
      "/estudiantes",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear estudiante:", error);
    throw error;
  }
}

export async function enrollStudent(
  id_estudiante: number,
  id_clase: number
): Promise<EnrollmentResponse> {
  try {
    const response = await axiosInstance.post<EnrollmentResponse>(
      "/matricula/assign",
      {
        id_estudiante,
        id_clase,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al matricular estudiante:", error);
    throw error;
  }
}

export async function bulkEnrollStudents(
  student_ids: number[],
  id_clase: number
): Promise<{ success: number; failed: number; errors: any[] }> {
  let success = 0;
  let failed = 0;
  const errors: any[] = [];

  for (const studentId of student_ids) {
    try {
      await enrollStudent(studentId, id_clase);
      success++;
    } catch (error) {
      failed++;
      errors.push({ studentId, error });
    }
  }

  return { success, failed, errors };
}
