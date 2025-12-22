import { TextInputProps, TouchableOpacityProps } from "react-native";

import { Control } from "react-hook-form";

export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string | null;
}

export interface Subject {
  name: string;
  secciones: Section[];
}

export interface Section {
  seccion_id: number;
  codigo: string;
  semestre: string;
  clase_id: number;
}

export interface SubjectData {
  secciones: Section[];
}

export interface SubjectsApiResponse {
  success: boolean;
  data: {
    [key: string]: SubjectData;
  };
}

export interface ReportApiResponse {
  success: boolean;
  data: Report[];
}

export interface Report {
  id: number;
  id_clase: number;
  fecha: string;
  titulo: string;
  total_estudiantes: number;
  total_presentes: number;
  total_ausentes: number;
  created_at: Date;
  updated_at: Date;
  Clase: string[];
}

export interface StudentsAPIResponse {
  success: boolean;
  data: Registration[];
}

export interface Registration {
  id_matricula: number;
  estudiante: Student;
}

export interface Student {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  created_at: Date;
  updated_at: Date;
  face_descriptor: number[] | null;
  foto_url: string | null;
}

export interface CardSubjectProps {
  item: Subject;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

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

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  buttonStyles?: string;
  isLoading?: boolean;
}
