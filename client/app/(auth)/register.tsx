import InputField from "@/components/InputField";
import { RegisterSchema, RegisterSchemaType } from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import CustomButton from "@/components/CustomButton";
import { useRef } from "react";
import {
  IconEmail,
  IconIdentity,
  IconPassword,
  IconUser,
} from "@/components/Icons";
import { registerService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

function Register() {
  const { login } = useAuth();
  const swiperRef = useRef<Swiper>(null);
  const { control, handleSubmit, trigger } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    const response = await registerService(data);
    if (response?.success) {
      // La respuesta tiene estructura: response.data.data.{token, refreshToken, profesor}
      const { token, refreshToken, profesor } = response.data.data;

      // Guardar tokens y datos del usuario
      await login(token, refreshToken, profesor);

      // Navegar a la pantalla protegida
      router.replace("/(protected)/home");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900 px-3 py-3">
      <Swiper
        loop={false}
        ref={swiperRef}
        paginationStyle={{ top: 10, bottom: undefined }}
        dot={<View className="w-14 h-3 bg-gray-600 rounded mx-2" />}
        activeDot={<View className="w-14 h-3 bg-sky-600 rounded mx-2" />}
        scrollEnabled={false}
      >
        <View className="flex-1">
          <Text className="text-4xl font-bold text-white mb-4 mt-12">
            Empecemos por tu datos personales
          </Text>
          <View className="gap-5 flex-1">
            <InputField
              name="nombres"
              control={control}
              label="Nombre"
              placeholder="Escribe tu nombre"
              icon={<IconUser />}
            />
            <InputField
              name="apellidos"
              control={control}
              label="Apellido"
              placeholder="Escribe tu apellido"
              icon={<IconUser />}
            />
            <InputField
              name="cedula"
              control={control}
              label="Cédula"
              placeholder="Escribe tu cédula"
              icon={<IconIdentity />}
              keyboardType="numeric"
            />
          </View>
          <CustomButton
            title="Siguiente"
            buttonStyles="mb-5"
            onPress={async () => {
              const isValid = await trigger(["nombres", "apellidos", "cedula"]);
              if (isValid) swiperRef.current?.scrollBy(1);
            }}
          />
        </View>
        <View className="flex-1">
          <Text className="text-4xl font-bold text-white mb-4 mt-12">
            Finaliza tu registro
          </Text>
          <View className="gap-5 flex-1">
            <InputField
              name="correo"
              control={control}
              label="Correo"
              placeholder="Escribe tu correo"
              icon={<IconEmail />}
            />
            <InputField
              name="contraseña"
              control={control}
              label="Contraseña"
              placeholder="Escribe tu contraseña"
              icon={<IconPassword />}
              secureTextEntry={true}
            />
            <InputField
              name="confirmarContraseña"
              control={control}
              label="Confirmar contraseña"
              placeholder="Confirma tu contraseña"
              icon={<IconPassword />}
              secureTextEntry={true}
            />
          </View>
          <CustomButton
            title="Registrarse"
            onPress={handleSubmit(onSubmit)}
            buttonStyles="mb-5"
          />
        </View>
      </Swiper>
    </SafeAreaView>
  );
}

export default Register;
