import { Text, View } from "react-native";
import { IconSadTear } from "./Icons";

function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <View className="items-center gap-3">
      {icon ? icon : <IconSadTear size={54} />}
      <Text className="text-2xl text-center text-white font-semibold">
        {title}
      </Text>
      <Text className="text-center text-lg mx-10 text-gray-300 font-medium">
        {description}
      </Text>
    </View>
  );
}

export default EmptyState;
