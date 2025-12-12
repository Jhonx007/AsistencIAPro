import { useState, ReactNode } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { IconMoreVertical } from "./Icons";

export interface DropdownMenuItem {
  label: string;
  icon?: ReactNode;
  onPress: () => void;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
}

function DropdownMenu({ items }: DropdownMenuProps) {
  const [visible, setVisible] = useState(false);

  const handleItemPress = (onPress: () => void) => {
    setVisible(false);
    onPress();
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <IconMoreVertical />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable className="flex-1" onPress={() => setVisible(false)}>
          <View className="absolute top-16 right-4 bg-gray-800 rounded-xl overflow-hidden shadow-lg min-w-[200px] border border-gray-700">
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleItemPress(item.onPress)}
                className={`flex-row items-center gap-3 px-4 py-4 ${
                  index !== items.length - 1 ? "border-b border-gray-700" : ""
                }`}
                activeOpacity={0.7}
              >
                {item.icon && <View>{item.icon}</View>}
                <Text className="text-white text-lg font-medium">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default DropdownMenu;
