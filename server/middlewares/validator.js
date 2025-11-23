// Middleware para validar datos
//le pasamos un esquema, que seria cada schema que creamos en el validator de cada modulo
export const validateData = (schema) => {
  return async (req, res, next) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData; // Actualizar con datos validados y transformados
      next();
    } catch (error) {
      // Los errores de Zod vienen en el mensaje como JSON string
      try {
        const errorsArray = JSON.parse(error.message);
        return res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: errorsArray.map((err) => ({
            campo: err.path.join("."),
            mensaje: err.message,
          })),
        });
      } catch (parseError) {
        // Si no se puede parsear, devolver error genérico
        return res.status(400).json({
          success: false,
          message: "Error de validación",
          error: error.message
        });
      }
    }
  }
}

// Middleware para validar parámetros
export const validateParams = (schema) => {
  return async (req, res, next) => {
    try {
      const validatedParams = await schema.parseAsync(req.params);
      req.params = validatedParams; // Actualizar con datos validados y transformados
      next()
    } catch (error) {
      // Los errores de Zod vienen en el mensaje como JSON string
      try {
        const errorsArray = JSON.parse(error.message);
        return res.status(400).json({
          success: false,
          message: "Error de validación de parámetros",
          errors: errorsArray.map((err) => ({
            campo: err.path.join("."),
            mensaje: err.message,
          })),
        });
      } catch (parseError) {
        // Si no se puede parsear, devolver error genérico
        return res.status(400).json({
          success: false,
          message: "Error de validación de parámetros",
          error: error.message
        });
      }
    }
  }
}