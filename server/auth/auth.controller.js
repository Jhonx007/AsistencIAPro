import supabase from "../config/supabase.js";
import prisma from "../config/prisma.js";

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return {
      status: 401,
      success: false,
      message: `Error de autenticación: ${error.message}`
    };
  }
  const profesor = await prisma.profesor.findUnique({
    where: {
      id: data.user.id
    }
  });

  if (!profesor) {
    return {
      status: 401,
      success: false,
      message: "Usuario no autorizado. Solo profesores pueden acceder."
    };
  }

  return {
    status: 200,
    success: true,
    message: "Login exitoso",
    data: {
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      profesor: {
        id: profesor.id,
        nombres: profesor.nombres,
        apellidos: profesor.apellidos,
        cedula: profesor.cedula,
        telefono: profesor.telefono
      }
    }
  };
}

async function register(data) {
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
    return {
      status: 400,
      success: false,
      message: `Error en Supabase Auth: ${authError.message}`
    };
  }
  // Registrar en la tabla Profesor
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

    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: data.correo,
      password: data.contraseña
    });

    if (sessionError) {
      return {
        status: 400,
        success: false,
        message: `Error al generar sesión: ${sessionError.message}`
      };
    }

    return {
      status: 201,
      success: true,
      message: "Profesor registrado exitosamente",
      data: {
        token: sessionData.session.access_token,
        refreshToken: sessionData.session.refresh_token,
        profesor: {
          id: profesorCreated.id,
          nombres: profesorCreated.nombres,
          apellidos: profesorCreated.apellidos,
          cedula: profesorCreated.cedula,
          telefono: profesorCreated.telefono
        }
      }
    };
  } catch (dbError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    return {
      status: 400,
      success: false,
      message: `Error al crear profesor en BD: ${dbError.message}`
    };
  }
}

export default {
  login,
  register
};
