import { z } from "zod";

export const CreateSubjectSchema = z.object({
  nombre: z
    .string({ message: "Nombre de la materia requerido" })
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  semestre: z
    .string({ message: "Semestre requerido" })
    .trim()
    .min(1, "El semestre es requerido")
    .max(20, "El semestre no puede exceder 20 caracteres"),
  seccion: z
    .string({ message: "Sección requerida" })
    .trim()
    .min(3, "La sección debe tener al menos 3 caracteres")
    .max(50, "La sección no puede exceder 50 caracteres"),
});

export type CreateSubjectSchemaType = z.infer<typeof CreateSubjectSchema>;
