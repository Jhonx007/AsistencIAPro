import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "@/utils/axios";
import Svg, { Defs, Mask, Rect, Ellipse } from "react-native-svg";

function RegisterFace() {
  const { studentId, studentName, studentIdentity } = useLocalSearchParams<{
    studentId: string;
    studentName: string;
    studentIdentity: string;
  }>();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facing, setFacing] = useState<"front" | "back">("front");

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  // Solicitar permisos al montar
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      if (photo) {
        setCapturedImage(photo.uri);
      }
    } catch (error) {
      console.error("Error al capturar foto:", error);
      Alert.alert("Error", "No se pudo capturar la foto. Intente de nuevo.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleSubmit = async () => {
    if (!capturedImage) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Preparar la imagen para el envío
      const filename = capturedImage.split("/").pop() || "face.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      console.log("URI de la imagen:", capturedImage);
      console.log("Nombre del archivo:", filename);
      console.log("Tipo de archivo:", type);

      // @ts-ignore - React Native maneja FormData de manera especial
      formData.append("image", {
        uri: capturedImage,
        name: filename,
        type,
      });

      // Enviar al endpoint correcto usando PATCH
      await axiosInstance.patch(
        `/estudiantes/${studentId}/register-face`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000, // 60 segundos para dar tiempo a la IA
        }
      );

      Alert.alert(
        "¡Éxito!",
        `El rostro de ${studentName} ha sido registrado correctamente.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error al registrar rostro:", error);
      Alert.alert("Error", "No se pudo registrar el rostro. Intente de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pantalla de carga de permisos
  if (!permission) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-white mt-4">Cargando cámara...</Text>
      </View>
    );
  }

  // Pantalla de permisos denegados
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center px-6">
        <Stack.Screen
          options={{
            title: "Registrar Rostro",
            headerStyle: { backgroundColor: "#111827" },
            headerTintColor: "#fff",
          }}
        />
        <Ionicons name="camera-outline" size={80} color="#6b7280" />
        <Text className="text-white text-xl font-bold mt-6 text-center">
          Permiso de cámara requerido
        </Text>
        <Text className="text-gray-400 text-center mt-2 mb-6">
          Para registrar el rostro del estudiante, necesitamos acceso a la
          cámara.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Permitir acceso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <Stack.Screen
        options={{
          title: studentName || "Registrar Rostro",
          headerStyle: { backgroundColor: "#111827" },
          headerTintColor: "#fff",
        }}
      />

      {/* Vista previa o cámara */}
      <View className="flex-1 relative">
        {capturedImage ? (
          // Mostrar imagen capturada
          <Image
            source={{ uri: capturedImage }}
            className="flex-1"
            resizeMode="cover"
            style={{ transform: [{ scaleX: facing === "front" ? -1 : 1 }] }}
          />
        ) : (
          // Mostrar cámara
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing={facing}
          />
        )}

        {/* Overlay con agujero ovalado usando SVG */}
        {/* Overlay con agujero ovalado usando SVG */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Svg height="100%" width="100%">
            <Defs>
              <Mask id="mask">
                {/* Fondo blanco = visible */}
                <Rect x="-2" y="-2" width="105%" height="105%" fill="white" />
                {/* Óvalo negro = transparente (agujero) */}
                <Ellipse cx="50%" cy="48%" rx="150" ry="180" fill="black" />
              </Mask>
            </Defs>
            {/* Rectángulo oscuro con máscara aplicada */}
            <Rect
              x="-2"
              y="-2"
              width="105%"
              height="105%"
              fill="rgba(0, 0, 0, 0.6)"
              mask="url(#mask)"
            />
            {/* Borde del óvalo */}
            <Ellipse
              cx="50%"
              cy="48%"
              rx="150"
              ry="180"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="10, 5"
            />
          </Svg>
        </View>

        {/* Texto de instrucción */}
        {!capturedImage && (
          <View className="absolute bottom-8 left-0 right-0">
            <Text className="text-white text-center text-lg font-medium px-4">
              Centra el rostro dentro del óvalo
            </Text>
          </View>
        )}
      </View>

      {/* Controles */}
      <View className="bg-gray-900 px-6 py-6">
        {capturedImage ? (
          // Botones después de capturar
          <View className="flex-row justify-center gap-4">
            <TouchableOpacity
              onPress={handleRetake}
              disabled={isSubmitting}
              className="flex-row items-center bg-gray-700 px-6 py-4 rounded-xl"
            >
              <Ionicons name="refresh" size={24} color="white" />
              <Text className="text-white font-bold ml-2 text-lg">
                Volver a tomar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="flex-row items-center bg-green-600 px-6 py-4 rounded-xl"
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Ionicons name="checkmark-circle" size={24} color="white" />
              )}
              <Text className="text-white font-bold ml-2 text-lg">
                {isSubmitting ? "Guardando..." : "Confirmar"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Botón de captura
          // Botón de captura y controles
          <View className="flex-row items-center justify-center gap-8">
            <TouchableOpacity onPress={handleCapture} disabled={isCapturing}>
              <View className="w-20 h-20 rounded-full bg-white/30 justify-center items-center border-4 border-white">
                {isCapturing ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <View className="w-[60px] h-[60px] rounded-full bg-white" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleCameraFacing}
              className="bg-gray-800 p-4 rounded-full absolute right-0"
            >
              <Ionicons name="camera-reverse" size={28} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Info del estudiante */}
        <View className="mt-4 bg-gray-800/50 rounded-xl p-4">
          <Text className="text-white text-center font-bold text-xl">
            {studentName}
          </Text>
          <Text className="text-gray-500 text-center text-lg">
            ID: {studentIdentity}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default RegisterFace;
