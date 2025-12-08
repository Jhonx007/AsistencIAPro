import axios from "axios";
import { Alert } from "react-native";

const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!backendURL) {
  console.error("❌ ERROR: EXPO_PUBLIC_BACKEND_URL no está definida en .env");
}

console.log("🔗 Backend URL:", backendURL);

const axiosInstance = axios.create({
  baseURL: backendURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para logging (útil para debug)
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      Alert.alert("Error", error.response.data.message);
    } else if (error.request) {
      // No hubo respuesta del servidor
      console.error("❌ Sin respuesta del servidor. Verifica que el backend esté corriendo.");
      Alert.alert("Error", "Sin respuesta del servidor. Verifica que el backend esté corriendo.");
    } else {
      console.error("❌ Error:", error.message);
      Alert.alert("Error", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
