import axiosInstance from "@/utils/axios";
import {
  ReportApiResponse,
  StudentsAPIResponse,
  SubjectsApiResponse,
} from "@/types/type";

export async function getSubjects(): Promise<SubjectsApiResponse> {
  try {
    const response = await axiosInstance.get<SubjectsApiResponse>(
      "/clases/myclasses/grouped/"
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
      `/reportes/clase/${id}`
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
      `/clases/${id}/estudiantes`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
