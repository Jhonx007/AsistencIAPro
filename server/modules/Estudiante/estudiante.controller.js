import estudianteService from "./estudiante.service.js";

// Para obtener todos los estudiantes
async function getAll(req, res) {
  try {
    const estudiantes = await estudianteService.getEstudiantes();

    return res.json({
      success: true,
      data: estudiantes
    });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener estudiantes',
      message: error.message
    });
  }
}


// Para obtener un estudiante por ID
async function getById(req, res) {
  try {
    const { id } = req.params;

    const estudiante = await estudianteService.getEstudianteById(id);

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        error: 'Estudiante no encontrado',
        message: 'Estudiante no encontrado'
      });
    }

    return res.json({
      success: true,
      data: estudiante
    });
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener estudiante',
      message: error.message
    });
  }
}

// Para crear un nuevo estudiante
async function create(req, res) {
  try {
    // Los datos ya vienen validados y transformados por el middleware
    const { nombres, apellidos, cedula } = req.body;

    const estudianteCreated = await estudianteService.createEstudiante({
      nombres,
      apellidos,
      cedula
    });

    return res.status(201).json({
      success: true,
      message: 'Estudiante creado exitosamente',
      data: estudianteCreated
    });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al crear estudiante',
      message: error.message
    });
  }
}

// Para actualizar un estudiante
async function update(req, res) {
  try {
    const { id } = req.params;
    // Los datos ya vienen validados y transformados por el middleware
    const { nombres, apellidos, cedula } = req.body;

    const estudianteUpdated = await estudianteService.updateEstudiante(id, {
      nombres,
      apellidos,
      cedula
    });

    return res.json({
      success: true,
      message: 'Estudiante actualizado exitosamente',
      data: estudianteUpdated
    });
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar estudiante',
      message: error.message
    });
  }
}

// Para eliminar un estudiante
async function deleteEstudiante(req, res) {
  try {
    const { id } = req.params;

    await estudianteService.deleteEstudiante(id);

    return res.status(201).json({
      success: true,
      message: 'Estudiante eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al eliminar estudiante',
      message: error.message
    });
  }
}

// Para registrar rostro de un estudiante
async function registerFace(req, res) {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No se ha subido ninguna imagen"
      });
    }

    // Call service to handle logic
    const updatedStudent = await estudianteService.registerFaceService(id, file.buffer);

    res.status(200).json({
      success: true,
      message: "Rostro registrado exitosamente",
      data: updatedStudent
    });

  } catch (error) {
    console.error("Error en registerFace:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor"
    });
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  deleteEstudiante,
  registerFace
};
