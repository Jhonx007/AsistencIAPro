import { z } from 'zod';

// Schema para registrar asistencias (múltiples)
export const registerAsistenciaSchema = z.object({
  asistencias: z.array(
    z.object({
      id_matricula: z.number({
        required_error: 'El ID de matrícula es requerido',
        invalid_type_error: 'El ID de matrícula debe ser un número'
      })
        .int('El ID de matrícula debe ser un número entero')
        .positive('El ID de matrícula debe ser positivo'),

      es_presente: z.boolean({
        required_error: 'El estado de presencia es requerido',
        invalid_type_error: 'El estado de presencia debe ser booleano (true/false)'
      })
    })
  )
    .min(1, 'Debe proporcionar al menos una asistencia')
    .max(100, 'No puede registrar más de 100 asistencias a la vez')
});

// Schema para actualizar una asistencia
export const updateAsistenciaSchema = z.object({
  es_presente: z.boolean({
    required_error: 'El estado de presencia es requerido',
    invalid_type_error: 'El estado de presencia debe ser booleano (true/false)'
  })
});

// Schema para validar ID en parámetros
export const idParamSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'El ID debe ser un número entero válido')
    .transform((val) => parseInt(val, 10))
});

// Schema para validar fecha en parámetros
export const fechaParamSchema = z.object({
  fecha: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD')
    .refine((date) => {
      const d = new Date(date);
      return d instanceof Date && !isNaN(d);
    }, 'Fecha inválida')
});

// Schema para autenticar asistencia con reconocimiento facial
export const authenticateFaceSchema = z.object({
  id_clase: z.string()
    .regex(/^\d+$/, 'El ID de clase debe ser un número entero válido')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'El ID de clase debe ser positivo')
});

export default {
  registerAsistenciaSchema,
  updateAsistenciaSchema,
  idParamSchema,
  fechaParamSchema,
  authenticateFaceSchema
};
