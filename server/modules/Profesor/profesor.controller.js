import profesorService from "./profesor.service.js"

// Para obtener todos los profesores
async function getAll(req, res) {
  try {
    const profesores = await profesorService.getProfesores();
    return res.json({
      success: true,
      data: profesores
    });
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error al obtener profesores',
      message: error.message 
    });
  }
}

// Para obtener un profesor por ID
async function getById(req, res) {
  try {
    const { id } = req.params;

    const profesor = await profesorService.getProfesorById(id);

    if (!profesor) {
      return res.status(404).json({
        success: false,
        error: 'Profesor no encontrado',
        message: 'Profesor no encontrado'
      });
    }

    return res.json({
      success: true,
      data: profesor
    });
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
    // Los datos ya vienen validados y transformados por el middleware
    const { correo, contraseña, nombres, apellidos, cedula, telefono } = req.body;

    const profesorCreated = await profesorService.createProfesor({
      correo,
      contraseña,
      nombres,
      apellidos,
      cedula,
      telefono
    });

    return res.status(201).json({
      success: true,
      message: 'Profesor creado exitosamente',
      data: profesorCreated
    });
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

    const profesorUpdated = await profesorService.updateProfesor(id, {
      nombres,
      apellidos,
      cedula,
      telefono
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

// Para eliminar un profesor
async function deleteProfesor(req, res) {
  try {
    const { id } = req.params;

    const profesorDeleted = await profesorService.deleteProfesor(id);

    return res.json({
      success: true,
      message: 'Profesor eliminado exitosamente',
      data: profesorDeleted
    });
  } catch (error) {
    console.error('Error al eliminar profesor:', error);
    return res.status(500).json({ 
      success: false,
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
