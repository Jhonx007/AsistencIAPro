import { z } from 'zod';

// Schema para crear un reporte
export const createReporteSchema = z.object({
  id_clase: z.number({
    required_error: 'El ID de la clase es requerido',
    invalid_type_error: 'El ID de la clase debe ser un número'
  }).int().positive(),
  
  fecha: z.string({
    required_error: 'La fecha es requerida'
  }).regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD'),
  
  titulo: z.string().optional(),
  
  total_estudiantes: z.number().int().nonnegative().optional(),
  total_presentes: z.number().int().nonnegative().optional(),
  total_ausentes: z.number().int().nonnegative().optional()
});

// Schema para validar ID en parámetros
export const idParamSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'El ID debe ser un número entero válido')
    .transform((val) => parseInt(val, 10))
});

export default {
  createReporteSchema,
  idParamSchema
};
