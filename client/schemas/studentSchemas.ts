import { z } from "zod";

export const CreateStudentSchema = z.object({
  nombres: z
    .string({ message: "Nombres requeridos" })
    .trim()
    .min(2, "Los nombres deben tener al menos 2 caracteres")
    .max(100, "Los nombres no pueden exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "Los nombres solo pueden contener letras y espacios"
    ),
  apellidos: z
    .string({ message: "Apellidos requeridos" })
    .trim()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(100, "Los apellidos no pueden exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "Los apellidos solo pueden contener letras y espacios"
    ),
  cedula: z
    .string({ message: "Cédula/ID requerido" })
    .trim()
    .min(3, "La cédula es demasiado corta")
    .max(20, "La cédula no puede exceder 20 caracteres")
    .regex(
      /^[VEJGP]?-?\d{1,3}\.?\d{3}\.?\d{3}$/i,
      "Formato de cédula inválido. Debe ser como: V-12.342.345, 12.342.345 o 12342345"
    ),
});

export type CreateStudentSchemaType = z.infer<typeof CreateStudentSchema>;
