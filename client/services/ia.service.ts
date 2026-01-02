import axiosInstance from "@/utils/axios";

export async function registerFaceStudent(
  studentId: string,
  formData: FormData
) {
  try {
    const response = await axiosInstance.patch(
      `/estudiantes/${studentId}/register-face`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 segundos para dar tiempo a la IA
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function facialAttendanceStudent(id: string, formData: FormData) {
  formData.append("id_clase", id);
  try {
    const response = await axiosInstance.post(
      `/asistencia/authenticate-face`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 segundos para dar tiempo a la IA
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
