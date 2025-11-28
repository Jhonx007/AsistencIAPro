import supabase from "../config/supabase.js";
import prisma from "../config/prisma.js";

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "No se proporcionó token de autenticación"
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o expirado"
      });
    }

    const profesor = await prisma.profesor.findUnique({
      where: {
        id: user.id
      }
    });

    if (!profesor) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. Solo profesores pueden acceder a este recurso."
      });
    }

    req.user = {
      id: profesor.id,
      nombres: profesor.nombres,
      apellidos: profesor.apellidos,
      cedula: profesor.cedula,
      email: user.email
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al verificar autenticación",
      error: error.message
    });
  }
}

export function verifyOwnership(req, res, next) {
  try {
    const { profesorId } = req.params;

    if (!profesorId) {
      return next();
    }

    if (req.user.id !== profesorId) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para acceder a este recurso"
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al verificar autorización",
      error: error.message
    });
  }
}

export function attachProfesorId(req, res, next) {
  try {
    req.profesorId = req.user.id;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud",
      error: error.message
    });
  }
}
