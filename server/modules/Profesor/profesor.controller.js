import prisma from "../../config/prisma.js";
import supabase from "../../config/supabase.js";

// Para obtener todos los profesores
async function getAll(req, res) {
  try {
    const profesores = await prisma.profesor.findMany();
    return res.json(profesores);
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    return res.status(500).json({ 
      error: 'Error al obtener profesores',
      message: error.message 
    });
  }
}

// Para obtener un profesor por ID
async function getById(req, res) {
  try {
    const { id } = req.params;

    const profesor = await prisma.profesor.findUnique({
      where: { id }
    });

    if (!profesor) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }

    return res.json(profesor);
  } catch (error) {
    console.error('Error al obtener profesor:', error);
    return res.status(500).json({ 
      error: 'Error al obtener profesor',
      message: error.message 
    });
  }
}

// Para crear un nuevo profesor
async function create(req, res) {
  try {
    const { correo, contraseña, nombres, apellidos, cedula, telefono } = req.body;

    if (!correo || !contraseña || !nombres || !apellidos || !cedula) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos',
        campos: ['correo', 'contraseña', 'nombres', 'apellidos', 'cedula']
      });
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: correo,
      password: contraseña,
      email_confirm: true, // Se auto-confirma el email, así no se envía
      user_metadata: {
        nombres,
        apellidos,
        cedula,
        role: 'profesor'
      }
    });

    if (authError) {
      console.error('Error al crear usuario en Supabase Auth:', authError);
      return res.status(400).json({ 
        error: 'Error al crear usuario en Supabase Auth',
        message: authError.message 
      });
    }

    // Se crea el registro en la tabla Profesor usando el UUID de Supabase
    try {
      const profesor = await prisma.profesor.create({
        data: {
          id: authData.user.id,
          nombres,
          apellidos,
          cedula,
          telefono: telefono || null
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Profesor creado exitosamente',
        data: {
          profesor,
          auth: {
            id: authData.user.id,
            email: authData.user.email
          }
        }
      });

    } catch (dbError) {
      // Si falla la creación en la BD, hacer rollback eliminando el usuario de Auth
      console.error('Error al crear profesor en BD. Haciendo rollback...', dbError);
      
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      return res.status(500).json({ 
        error: 'Error al crear profesor en la base de datos',
        message: dbError.message 
      });
    }

  } catch (error) {
    console.error('Error general al crear profesor:', error);
    return res.status(500).json({ 
      error: 'Error al crear profesor',
      message: error.message 
    });
  }
}

// Para actualizar un profesor
async function update(req, res) {
  try {
    const { id } = req.params;
    const { nombres, apellidos, cedula, telefono } = req.body;

    const profesorUpdated = await prisma.profesor.update({
      where: { id },
      data: {
        nombres,
        apellidos,
        cedula,
        telefono
      }
    });

    return res.json({
      success: true,
      message: 'Profesor actualizado exitosamente',
      data: profesorUpdated
    });
  } catch (error) {
    console.error('Error al actualizar profesor:', error);
    return res.status(500).json({ 
      error: 'Error al actualizar profesor',
      message: error.message 
    });
  }
}

// Para eliminar un profesor en la tabla Profesor y la tabla Users de Supabase
async function deleteProfesor(req, res) {
  try {
    const { id } = req.params;

    const profesorDeleted = await prisma.profesor.delete({
      where: { id }
    });

    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
      console.error('Error al eliminar usuario de Auth:', authError);
      // Continuar aunque falle (el registro ya fue eliminado de la BD)
    }

    return res.json({
      success: true,
      message: 'Profesor eliminado exitosamente',
      data: profesorDeleted
    });
  } catch (error) {
    console.error('Error al eliminar profesor:', error);
    return res.status(500).json({ 
      error: 'Error al eliminar profesor',
      message: error.message 
    });
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  deleteProfesor
};
