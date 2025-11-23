import { z } from 'zod';

// Schema para crear un profesor
export const createProfesorSchema = z.object({
  nombres: z.string()
    .min(2, 'Los nombres deben tener al menos 2 caracteres')
    .max(100, 'Los nombres no pueden exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los nombres solo pueden contener letras y espacios'),
  
  apellidos: z.string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras y espacios'),
  
  cedula: z.string()
    .trim()
    .min(3, 'La cédula es demasiado corta')
    .max(20, 'La cédula no puede exceder 20 caracteres')
    .regex(
      /^[VEJGP]?-?\d{1,3}\.?\d{3}\.?\d{3}$/i,
      'Formato de cédula inválido. Debe ser como: V-12.342.345, 12.342.345 o 12342345'
    )
    .transform((val) => {
      // Extraer solo los números
      const numeros = val.replace(/[^0-9]/g, '');
      
      // Formatear con puntos: 12342345 → 12.342.345
      const formatted = numeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return formatted;
    }),
  
  correo: z.string()
    .email('Correo electrónico inválido')
    .toLowerCase()
    .trim(),
  
  contraseña: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres'),
  
  telefono: z.string()
    .min(7, 'El teléfono debe tener al menos 7 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .regex(/^[0-9+\-\s()]+$/, 'El teléfono solo puede contener números y caracteres válidos (+, -, espacios, paréntesis)')
    .optional()
    .nullable()
});

// Schema para actualizar un profesor
export const updateProfesorSchema = z.object({
  nombres: z.string()
    .min(2, 'Los nombres deben tener al menos 2 caracteres')
    .max(100, 'Los nombres no pueden exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los nombres solo pueden contener letras y espacios')
    .optional(),
  
  apellidos: z.string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras y espacios')
    .optional(),
  
  cedula: z.string()
    .trim()
    .min(3, 'La cédula es demasiado corta')
    .max(20, 'La cédula no puede exceder 20 caracteres')
    .regex(
      /^[VEJGP]?-?\d{1,3}\.?\d{3}\.?\d{3}$/i,
      'Formato de cédula inválido. Debe ser como: V-12.342.345, 12.342.345 o 12342345'
    )
    .transform((val) => {
      // Extraer solo los números
      const numeros = val.replace(/[^0-9]/g, '');
      
      // Formatear con puntos: 12342345 → 12.342.345
      const formatted = numeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return formatted;
    })
    .optional(),
  
  telefono: z.string()
    .min(7, 'El teléfono debe tener al menos 7 caracteres')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .regex(/^[0-9+\-\s()]+$/, 'El teléfono solo puede contener números y caracteres válidos (+, -, espacios, paréntesis)')
    .optional()
    .nullable(),
  
  correo: z.string()
    .email('Correo electrónico inválido')
    .toLowerCase()
    .trim()
    .optional(),
  
  contraseña: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Debe proporcionar al menos un campo para actualizar' }
);

// Schema para validar parámetros de ID en la URL
export const idParamSchema = z.object({
  id: z.string().uuid('El ID debe ser un UUID válido')
});

export default {
  createProfesorSchema,
  updateProfesorSchema,
  idParamSchema
};
