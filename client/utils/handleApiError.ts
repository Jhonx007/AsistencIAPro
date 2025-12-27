import { Alert } from "react-native";

export function handleApiError(
  error: any,
  defaultMessage: string = "Ocurrió un error"
) {
  let message = defaultMessage;
  let title = "Atención";

  if (error.response) {
    // El servidor respondió con un código de error (4xx, 5xx)
    message = error.response.data?.message || defaultMessage;
  } else if (error.request) {
    // No hubo respuesta del servidor (Problema de Red)
    title = "Error de Conexión";
    message =
      "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
  } else {
    // Error al configurar la petición
    message = error.message || defaultMessage;
  }

  Alert.alert(title, message);
}
