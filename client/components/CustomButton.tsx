import { ButtonProps } from "@/types/type";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";

function CustomButton({
  title,
  onPress,
  buttonStyles,
  isLoading,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className={`bg-sky-500 p-4 rounded-lg ${buttonStyles} ${isLoading ? "opacity-50" : ""}`}
    >
      <View className="min-h-[24px] items-center justify-center">
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text className="text-white text-center text-lg font-semibold">
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default CustomButton;
