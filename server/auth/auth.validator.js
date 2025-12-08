import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

export const registerSchema = z.object({
  correo: z.string().email({ message: "Email inválido" }),
  contraseña: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  nombres: z.string().min(2, { message: "Los nombres deben tener al menos 2 caracteres" }),
  apellidos: z.string().min(2, { message: "Los apellidos deben tener al menos 2 caracteres" }),
  cedula: z.string().min(5, { message: "La cédula debe tener al menos 5 caracteres" }),
  telefono: z.string().optional()
});
