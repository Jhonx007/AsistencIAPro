import { z } from 'zod';

// Schema para asignar una matrícula (crear)
export const assignMatriculaSchema = z.object({
  id_estudiante: z.number({
    required_error: 'El ID del estudiante es requerido',
    invalid_type_error: 'El ID del estudiante debe ser un número'
  })
    .int('El ID del estudiante debe ser un número entero')
    .positive('El ID del estudiante debe ser positivo'),
  
  id_seccion: z.number({
    required_error: 'El ID de la sección es requerido',
    invalid_type_error: 'El ID de la sección debe ser un número'
  })
    .int('El ID de la sección debe ser un número entero')
    .positive('El ID de la sección debe ser positivo')
});

// Schema para validar parámetros de ID en la URL
export const idParamSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'El ID debe ser un número entero válido')
    .transform((val) => parseInt(val, 10))
});

export default {
  assignMatriculaSchema,
  idParamSchema
};
