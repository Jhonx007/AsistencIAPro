import InputField from "@/components/InputField";
import Logo from "@/components/Logo";
import { LoginSchema, LoginSchemaType } from "@/schemas/authSchemas";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import CustomButton from "@/components/CustomButton";
import { useState } from "react";

function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      setIsLoading(true);

      const response = await loginService(data);

      if (response?.success) {
        const { token, refreshToken, profesor } = response.data.data;
        await login(token, refreshToken, profesor);
        router.replace("/(protected)/home");
      }
    } catch (error) {
      console.error("Error en login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 gap-6 bg-gray-900 px-3 py-10">
      <View className="flex-row items-center gap-3 mb-4">
        <Logo />
        <Text className="text-white text-3xl font-bold">AsistencIAPro</Text>
      </View>
      <Text className="text-4xl font-bold text-white mb-3">
        Bienvenido, Profesor
      </Text>
      <InputField
        name="email"
        control={control}
        label="Correo Institucional"
        placeholder="Escribe tu correo institucional"
        icon={<Feather name="mail" size={22} color="gray" />}
      />
      <InputField
        name="password"
        control={control}
        label="Contraseña"
        placeholder="Escribe tu contraseña"
        secureTextEntry={true}
        icon={<Feather name="lock" size={22} color="gray" />}
      />
      <Text className="text-lg text-gray-200">
        ¿No tienes una cuenta?{" "}
        <Link href="/(auth)/register" className="text-sky-600 font-semibold">
          Registrate
        </Link>
      </Text>
      <CustomButton
        title="Iniciar Sesión"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
}

export default Login;
