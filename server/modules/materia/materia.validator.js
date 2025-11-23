import { z } from "zod"
export const createMateriaSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),
})

export const updateMateriaSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),
})

export const idMateriaSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "El ID debe ser un número válido")
    .transform(Number)
    .refine((val) => val > 0, "El ID debe ser mayor a 0"),
})


