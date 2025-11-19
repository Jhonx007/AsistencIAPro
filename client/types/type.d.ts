import { TextInputProps } from "react-native";

import { Control } from "react-hook-form";

export interface InputFieldProps extends TextInputProps {
  name: string;
  control: Control<any>;
  label: string;
  errorMessage?: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
}
