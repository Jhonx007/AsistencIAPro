import prisma from "../../config/prisma.js";
import supabase from "../../config/supabase.js";

async function getProfesores() {
  const profesores = await prisma.profesor.findMany();
  return profesores;
}

async function getProfesorById(id) {
  const profesor = await prisma.profesor.findUnique({
    where: {
      id: id
    }
  });

  return profesor;
}

async function createProfesor(data) {
  // Se registra el profesor en la tabla Users de Supabase
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: data.correo,
    password: data.contraseña,
    email_confirm: true,
    user_metadata: {
      nombres: data.nombres,
      apellidos: data.apellidos,
      cedula: data.cedula,
      role: "profesor"
    }
  });

  if (authError) {
    throw new Error(`Error en Supabase Auth: ${authError.message}`);
  }

  // Luego se registra en la tabla Profesor
  try {
    const profesorCreated = await prisma.profesor.create({
      data: {
        id: authData.user.id,
        nombres: data.nombres,
        apellidos: data.apellidos,
        cedula: data.cedula,
        telefono: data.telefono || null
      }
    });

    return profesorCreated;
  } catch (dbError) {
    // Rollback: eliminar usuario de Auth si falla la BD
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(`Error al crear profesor en BD: ${dbError.message}`);
  }
}

async function updateProfesor(id, data) {
  // Separar campos que van a Prisma vs Supabase Auth
  const { correo, contraseña, ...prismaData } = data;
  
  // Actualizar en Prisma solo si hay datos para la BD
  let profesorUpdated = null;
  if (Object.keys(prismaData).length > 0) {
    profesorUpdated = await prisma.profesor.update({
      where: { id: id },
      data: prismaData
    });
  }

  // Preparar actualizaciones para Supabase Auth
  const authUpdates = {};
  const metadataUpdates = {};

  // Actualizar email si se proporciona
  if (correo) {
    authUpdates.email = correo;
    authUpdates.email_confirm = true; // Auto-confirmar el nuevo email
  }

  // Actualizar contraseña si se proporciona
  if (contraseña) {
    authUpdates.password = contraseña;
  }

  // Actualizar metadata (nombres, apellidos, cedula)
  if (data.nombres) metadataUpdates.nombres = data.nombres;
  if (data.apellidos) metadataUpdates.apellidos = data.apellidos;
  if (data.cedula) metadataUpdates.cedula = data.cedula;

  if (Object.keys(metadataUpdates).length > 0) {
    authUpdates.user_metadata = metadataUpdates;
  }

  // Actualizar en Supabase Auth si hay cambios
  if (Object.keys(authUpdates).length > 0) {
    const { error } = await supabase.auth.admin.updateUserById(id, authUpdates);
    
    if (error) {
      throw new Error(`Error al actualizar en Supabase Auth: ${error.message}`);
    }
  }

  // Si no se actualizó en Prisma, obtener los datos actuales
  if (!profesorUpdated) {
    profesorUpdated = await prisma.profesor.findUnique({
      where: { id: id }
    });
  }

  return profesorUpdated;
}

async function deleteProfesor(id) {
  // Primero eliminar de Supabase Auth
  const { error: authError } = await supabase.auth.admin.deleteUser(id);

  if (authError) {
    throw new Error(`Error al eliminar usuario de Auth: ${authError.message}`);
  }

  // Luego eliminar de la tabla Profesor
  const profesorDeleted = await prisma.profesor.delete({
    where: {
      id: id
    }
  });
  return profesorDeleted;
}

export default {
  getProfesores,
  getProfesorById,
  createProfesor,
  updateProfesor,
  deleteProfesor
};