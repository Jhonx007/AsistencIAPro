import axios from "axios";

import { getAccessToken } from "./storage";

const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!backendURL) {
  console.error("❌ ERROR: EXPO_PUBLIC_BACKEND_URL no está definida en .env");
}

let requestCounter = 1;

const axiosInstance = axios.create({
  baseURL: backendURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para agregar token y logging
axiosInstance.interceptors.request.use(
  async (config) => {
    const requestId = requestCounter++;
    // Adjuntamos el ID a la config para usarlo en la respuesta
    (config as any).metadata = { requestId };

    // Obtener el token del almacenamiento seguro
    const token = await getAccessToken();

    console.log(`🚀 [#${requestId}] Token:`, token);

    // Si hay token, agregarlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `📡 [#${requestId}] ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  // Si la respuesta es exitosa
  (response) => {
    const { requestId } = (response.config as any).metadata || {};
    console.log(`✅ [#${requestId}] Respuesta exitosa`);
    return response;
  },
  // Si la respuesta es un error
  (error) => {
    const { requestId } = (error.config as any)?.metadata || {};
    const prefix = requestId ? `[#${requestId}] ` : "";

    if (error.response) {
      // El servidor respondió con un código de error
      console.log(
        `❌ ${prefix}Error ${error.response.status}:`,
        error.response.data
      );
    } else if (error.request) {
      // No hubo respuesta del servidor (Problema de Red)
      console.error(
        `❌ ${prefix}Sin respuesta del servidor. Verifica que el backend esté corriendo.`
      );
      // Alert eliminado para evitar duplicidad. Se maneja en handleApiError.
    } else {
      // Error al configurar la petición
      console.error(`❌ ${prefix}Error:`, error.message);
      // Alert eliminado para evitar duplicidad. Se maneja en handleApiError.
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
