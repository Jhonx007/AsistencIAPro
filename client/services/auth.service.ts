import { RegisterSchemaType, LoginSchemaType } from "@/schemas/authSchemas";
import axiosInstance from "@/utils/axios";

export async function registerService(data: RegisterSchemaType) {
  try {
    const response = await axiosInstance.post("/auth/register", {
      nombres: data.nombres,
      apellidos: data.apellidos,
      cedula: data.cedula,
      correo: data.correo,
      contraseña: data.contraseña
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al registrar usuario",
      status: error.response?.status
    };
  }
}

export async function loginService(data: LoginSchemaType) {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email: data.email,
      password: data.password
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {    
    return {
      success: false,
      message: error.response?.data?.message || "Error al iniciar sesión",
      status: error.response?.status
    };
  }
}