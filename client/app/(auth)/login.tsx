import InputField from "@/components/InputField";
import Logo from "@/components/Logo";
import { LoginSchema, LoginSchemaType } from "@/schemas/authSchemas";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Login() {
  const { control, handleSubmit } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginSchemaType) => {
    console.log(data);
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
        icon={<Feather name="lock" size={22} color="gray" className="mr-3" />}
      />
      <Text className="text-lg text-gray-200">
        ¿No tienes una cuenta?{" "}
        <Link href="/(auth)/register" className="text-sky-600 font-semibold">
          Registrate
        </Link>
      </Text>
      <TouchableOpacity
        className="bg-sky-600 p-4 rounded-lg"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-center text-white text-lg font-semibold">
          Iniciar Sesión
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default Login;
