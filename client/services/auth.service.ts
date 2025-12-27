import { RegisterSchemaType, LoginSchemaType } from "@/schemas/authSchemas";
import { AuthResponse } from "@/types/type";
import axiosInstance from "@/utils/axios";

export async function registerService(
  data: RegisterSchemaType
): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.post("/auth/register", {
      nombres: data.nombres,
      apellidos: data.apellidos,
      cedula: data.cedula,
      correo: data.correo,
      contraseña: data.contraseña,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function loginService(
  data: LoginSchemaType
): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email: data.email,
      password: data.password,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
