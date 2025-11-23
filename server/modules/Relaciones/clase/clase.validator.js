import { z } from "zod"

export const createClaseSchema = z.object({
  profesorId: z
    .string({
      required_error: "El ID del profesor es requerido",
    })
    .uuid("El ID del profesor debe ser un UUID válido"),
  materiaId: z
    .number({
      required_error: "El ID de la materia es requerido",
    })
    .int("El ID de la materia debe ser un número entero")
    .positive("El ID de la materia debe ser positivo"),
  codigo: z
    .string({
      required_error: "El código de la sección es requerido",
    })
    .min(1, "El código no puede estar vacío")
    .trim(),
  semestre: z
    .string({
      required_error: "El semestre es requerido",
    })
    .min(1, "El semestre no puede estar vacío")
    .trim(),
})

export const idClaseSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "El ID debe ser un número válido")
    .transform(Number)
    .refine((val) => val > 0, "El ID debe ser mayor a 0"),
})

export const profesorIdSchema = z.object({
  profesorId: z
    .string({
      required_error: "El ID del profesor es requerido",
    })
    .uuid("El ID del profesor debe ser un UUID válido"),
})

export const assignClaseSchema = z.object({
  profesorId: z
    .string({
      required_error: "El ID del profesor es requerido",
    })
    .uuid("El ID del profesor debe ser un UUID válido"),
  materiaId: z
    .number({
      required_error: "El ID de la materia es requerido",
    })
    .int("El ID de la materia debe ser un número entero")
    .positive("El ID de la materia debe ser positivo"),
  seccionId: z
    .number({
      required_error: "El ID de la sección es requerido",
    })
    .int("El ID de la sección debe ser un número entero")
    .positive("El ID de la sección debe ser positivo"),
})
