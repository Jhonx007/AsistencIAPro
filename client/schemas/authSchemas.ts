import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ message: "Correo requerido" })
    .min(1, "Correo requerido")
    .trim()
    .email("Correo inválido"),
  password: z
    .string({ message: "Contraseña requerida" })
    .trim()
    .min(1, "Contraseña requerida")
    .min(8, "La contraseña debe tener mínimo 8 caracteres"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
