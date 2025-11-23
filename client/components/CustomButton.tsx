import { ButtonProps } from "@/types/type";
import { Text, TouchableOpacity } from "react-native";

function CustomButton({ title, onPress, buttonStyles }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-sky-500 p-4 rounded-lg ${buttonStyles}`}
    >
      <Text className="text-white text-center text-lg font-semibold">
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default CustomButton;
