import matriculaServices from "./matricula.services.js";

// Para obtener todas las matrículas
async function getAllMatriculas(req, res) {
  try {
    const matriculas = await matriculaServices.getMatriculas();

    return res.json({
      success: true,
      data: matriculas
    });
  } catch (error) {
    console.error('Error al obtener matrículas:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error al obtener matrículas',
      message: error.message 
    });
  }
}

// Para obtener una matrícula por ID
async function getMatriculaById(req, res) {
  try {
    const { id } = req.params;

    const matricula = await matriculaServices.getMatriculaById(id);

    if (!matricula) {
      return res.status(404).json({
        success: false,
        error: 'Matrícula no encontrada',
        message: 'Matrícula no encontrada'
      });
    }

    return res.json({
      success: true,
      data: matricula
    });
  } catch (error) {
    console.error('Error al obtener matrícula:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener matrícula',
      message: error.message
    });
  }
}

// Para asignar un estudiante a una clase (crear matrícula)
async function assignMatricula(req, res) {
  try {
    const { id_clase, id_estudiante } = req.body;

    const matriculaCreated = await matriculaServices.assignMatricula({
      id_clase,
      id_estudiante
    });

    return res.status(201).json({
      success: true,
      message: 'Matrícula asignada exitosamente',
      data: matriculaCreated
    });
  } catch (error) {
    console.error('Error al asignar matrícula:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al asignar matrícula',
      message: error.message
    });
  }
}

// Para eliminar una matrícula
async function deleteMatricula(req, res) {
  try {
    const { id } = req.params;

    await matriculaServices.deleteMatricula(id);

    return res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar matrícula:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al eliminar matrícula',
      message: error.message
    });
  }
}

export default {
  getAllMatriculas,
  getMatriculaById,
  assignMatricula,
  deleteMatricula
};