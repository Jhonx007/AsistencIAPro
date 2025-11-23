import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ message: "Correo requerido" })
    .trim()
    .min(1, "Correo requerido")
    .email("Correo inválido"),
  password: z
    .string({ message: "Contraseña requerida" })
    .trim() 
    .min(1, "Contraseña requerida")
    .min(8, "La contraseña debe tener mínimo 8 caracteres"),
});

export const RegisterSchema = z.object({
    name: z
      .string({ message: "Nombre requerido" })
      .trim()
      .min(1, "Nombre requerido")
      .max(25, "El nombre debe tener máximo 25 caracteres"),
    lastName: z
      .string({ message: "Apellido requerido" })
      .trim()
      .min(1, "Apellido requerido")
      .max(25, "El apellido debe tener máximo 25 caracteres"),
    identity: z
      .string({ message: "Cédula requerida" })
      .trim()
      .min(7, "Cédula debe tener mínimo 7 caracteres")
      .max(8, "Cédula debe tener máximo 8 caracteres"),
    email: z
      .string({ message: "Correo requerido" })
      .trim()
      .min(1, "Correo requerido")
      .email("Correo inválido"),
    password: z
      .string({ message: "Contraseña requerida" })
      .trim()
      .min(1, "Contraseña requerida")
      .min(8, "La contraseña debe tener mínimo 8 caracteres"),
    confirmPassword: z
      .string({ message: "Confirmar contraseña es requerido" })
      .trim()
      .min(1, "Confirmar contraseña es requerido")
      .min(8, "La contraseña debe tener mínimo 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
