// Middleware para validar datos
//le pasamos un esquema, que seria cada schema que creamos en el validator de cada modulo
export const validateData = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body)
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: error.errors.map((err) => ({
          campo: err.path.join("."),
          mensaje: err.message,
        })),
      })
    }
  }
}

// Middleware para validar parámetros
export const validateParams = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.params)
      next()
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error de validación de parámetros",
        errors: error.errors.map((err) => ({
          campo: err.path.join("."),
          mensaje: err.message,
        })),
      })
    }
  }
}