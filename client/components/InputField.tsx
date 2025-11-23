import { InputFieldProps } from "@/types/type";
import { Controller } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { IconEye, IconEyeOff } from "./Icons";

export default function InputField({
  name,
  control,
  label,
  labelStyle,
  containerStyle,
  inputStyle,
  icon,
  secureTextEntry = false,
  ...props
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="gap-2 w-full mb-2">
      <Text className={`text-white text-xl font-semibold ${labelStyle}`}>
        {label}
      </Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <View
              className={`flex flex-row items-center rounded-lg border px-4 ${
                error
                  ? "border-red-500 bg-red-950 focus:border-red-300"
                  : "border-gray-600 bg-zinc-900 focus:border-sky-500"
              } ${containerStyle}`}
            >
              {icon && <View className="mr-3">{icon}</View>}

              <TextInput
                value={value}
                onChangeText={onChange}
                placeholderTextColor="gray"
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                className={`flex-1 py-4 text-white text-lg font-semibold ${inputStyle}`}
                {...props}
              />

              {secureTextEntry && (
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <IconEye /> : <IconEyeOff />}
                </TouchableOpacity>
              )}
            </View>

            {error && (
              <Text className="text-red-500  ml-1">{error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
}
