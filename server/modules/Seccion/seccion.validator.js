import { z } from "zod"

export const createSeccionSchema = z.object({
  id_materia: z
    .number({
      required_error: "El ID de la materia es requerido",
    })
    .int("El ID de la materia debe ser un número entero")
    .positive("El ID de la materia debe ser mayor a 0"),
  codigo: z
    .string({
      required_error: "El código es requerido",
    })
    .min(3, "El código debe tener al menos 3 caracteres")
    .max(50, "El código no puede exceder 50 caracteres")
    .trim(),
  semestre: z
    .string({
      required_error: "El semestre es requerido",
    })
    .min(1, "El semestre es requerido")
    .max(20, "El semestre no puede exceder 20 caracteres")
    .trim(),
})

export const updateSeccionSchema = z.object({
  id_materia: z
    .number()
    .int("El ID de la materia debe ser un número entero")
    .positive("El ID de la materia debe ser mayor a 0")
    .optional(),
  codigo: z
    .string()
    .min(3, "El código debe tener al menos 3 caracteres")
    .max(50, "El código no puede exceder 50 caracteres")
    .trim()
    .optional(),
  semestre: z
    .string()
    .min(1, "El semestre es requerido")
    .max(20, "El semestre no puede exceder 20 caracteres")
    .trim()
    .optional(),
})

export const idSeccionSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "El ID debe ser un número válido")
    .transform(Number)
    .refine((val) => val > 0, "El ID debe ser mayor a 0"),
})
