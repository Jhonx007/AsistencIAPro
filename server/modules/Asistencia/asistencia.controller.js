import asistenciaService from "./asistencia.service.js";

// Para registrar múltiples asistencias
async function registerAsistencia(req, res) {
  try {
    const { asistencias } = req.body;

    const asistenciasCreated = await asistenciaService.registerAsistencia({
      asistencias
    });

    return res.status(201).json({
      success: true,
      message: 'Asistencias registradas exitosamente',
      data: asistenciasCreated
    });
  } catch (error) {
    console.error('Error al registrar asistencias:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al registrar asistencias',
      message: error.message
    });
  }
}

// Para obtener todas las asistencias
async function getAllAsistencias(req, res) {
  try {
    const asistencias = await asistenciaService.getAsistencias();

    return res.json({
      success: true,
      data: asistencias
    });
  } catch (error) {
    console.error('Error al obtener asistencias:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener asistencias',
      message: error.message
    });
  }
}

// Para obtener asistencias por matrícula
async function getAsistenciasByMatricula(req, res) {
  try {
    const { id } = req.params;

    const asistencias = await asistenciaService.getAsistenciasByMatricula(id);

    return res.json({
      success: true,
      data: asistencias
    });
  } catch (error) {
    console.error('Error al obtener asistencias por matrícula:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener asistencias por matrícula',
      message: error.message
    });
  }
}

// Para obtener asistencias por fecha
async function getAsistenciasByFecha(req, res) {
  try {
    const { fecha } = req.params;

    const asistencias = await asistenciaService.getAsistenciasByFecha(fecha);

    return res.json({
      success: true,
      data: asistencias
    });
  } catch (error) {
    console.error('Error al obtener asistencias por fecha:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener asistencias por fecha',
      message: error.message
    });
  }
}

// Para actualizar una asistencia
async function updateAsistencia(req, res) {
  try {
    const { id } = req.params;
    const { es_presente } = req.body;

    const asistenciaUpdated = await asistenciaService.updateAsistencia(id, {
      es_presente
    });

    return res.json({
      success: true,
      message: 'Asistencia actualizada exitosamente',
      data: asistenciaUpdated
    });
  } catch (error) {
    console.error('Error al actualizar asistencia:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar asistencia',
      message: error.message
    });
  }
}

// Para eliminar una asistencia
async function deleteAsistencia(req, res) {
  try {
    const { id } = req.params;

    await asistenciaService.deleteAsistencia(id);

    return res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar asistencia:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al eliminar asistencia',
      message: error.message
    });
  }
}

// Para autenticar asistencia mediante reconocimiento facial
async function authenticateFaceAttendance(req, res) {
  try {
    const { id_clase } = req.body;

    // Validar que se haya enviado una imagen
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Imagen no proporcionada',
        message: 'Debe enviar una imagen para autenticar la asistencia'
      });
    }

    const imageBuffer = req.file.buffer;

    // Llamar al servicio de autenticación facial
    const result = await asistenciaService.authenticateAttendanceByFace(
      parseInt(id_clase),
      imageBuffer
    );

    return res.status(200).json({
      success: true,
      message: `Asistencia registrada exitosamente para ${result.estudiante.nombres} ${result.estudiante.apellidos}`,
      data: {
        estudiante: result.estudiante,
        asistencia: result.asistencia,
        reporte: result.reporte,
        matchInfo: result.matchInfo
      }
    });

  } catch (error) {
    console.error('Error al autenticar asistencia facial:', error);

    // Manejo de errores específicos
    if (error.message.includes('No se detectó ningún rostro')) {
      return res.status(400).json({
        success: false,
        error: 'Rostro no detectado',
        message: 'No se detectó ningún rostro en la imagen. Por favor, intente nuevamente con una imagen clara de su rostro.'
      });
    }

    if (error.message.includes('Rostro no reconocido')) {
      return res.status(404).json({
        success: false,
        error: 'Rostro no reconocido',
        message: 'No se encontró coincidencia con ningún estudiante matriculado en esta clase. Asegúrese de tener su rostro registrado.'
      });
    }

    if (error.message.includes('Ya registraste asistencia')) {
      return res.status(409).json({
        success: false,
        error: 'Asistencia duplicada',
        message: 'Ya registraste tu asistencia en esta clase hoy.'
      });
    }

    if (error.message.includes('No hay estudiantes')) {
      return res.status(404).json({
        success: false,
        error: 'Sin estudiantes registrados',
        message: 'No hay estudiantes con rostro registrado matriculados en esta clase.'
      });
    }

    // Error genérico
    return res.status(500).json({
      success: false,
      error: 'Error al autenticar asistencia',
      message: error.message
    });
  }
}

export default {
  registerAsistencia,
  getAllAsistencias,
  getAsistenciasByMatricula,
  getAsistenciasByFecha,
  updateAsistencia,
  deleteAsistencia,
  authenticateFaceAttendance
};
