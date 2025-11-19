import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { View } from "react-native";

function Logo() {
  return (
    <View className="bg-blue-950/80 p-2.5 rounded-lg">
      <SimpleLineIcons name="graduation" size={25} color="blue" />
    </View>
  );
}

export default Logo;
