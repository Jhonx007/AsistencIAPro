import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";

export function IconUser() {
  return <Feather name="user" size={22} color="gray" />;
}

export function IconIdentity() {
  return <FontAwesome6 name="users-rectangle" size={22} color="gray" />;
}

export function IconEmail() {
  return <Feather name="mail" size={22} color="gray" />;
}

export function IconPassword() {
  return <Feather name="lock" size={22} color="gray" />;
}

export function IconEye() {
  return <Feather name="eye" size={22} color="gray" />;
}

export function IconEyeOff() {
  return <Feather name="eye-off" size={22} color="gray" />;
}

export function IconBook() {
  return <Feather name="book-open" size={22} color="#3b82f6" />;
}

export function IconRigthArrow() {
  return <MaterialIcons name="keyboard-arrow-right" size={24} color="gray" />;
}

export function IconDownArrow() {
  return <MaterialIcons name="keyboard-arrow-down" size={24} color="gray" />;
}

export function IconLogout() {
  return <MaterialIcons name="logout" size={26} color="white" />;
}

export function IconSadTear({
  size,
  color = "gray",
}: {
  size: number;
  color?: string;
}) {
  return (
    <MaterialCommunityIcons
      name="emoticon-sad-outline"
      size={size}
      color={color}
    />
  );
}

export function IconFile() {
  return <Feather name="file-text" size={24} color="gray" />;
}

export function IconMoreVertical() {
  return <Feather name="more-vertical" size={24} color="white" />;
}

export function IconUsers() {
  return <Feather name="users" size={20} color="white" />;
}

export function IconProfile() {
  return <FontAwesome6 name="user-large" size={20} color="gray" />;
}

export function IconFace() {
  return <MaterialIcons name="face" size={24} color="#22c55e" />;
}

export function IconCheck() {
  return <Ionicons name="checkmark-circle" size={16} color="#22c55e" />;
}

export function IconAlert() {
  return <Ionicons name="alert-circle" size={16} color="#f59e0b" />;
}

export function IconCamera() {
  return <Ionicons name="camera" size={22} color="white" />;
}
