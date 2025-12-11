import reporteService from "./reporte.service.js";

// Obtener reportes de una clase
async function getReportesByClase(req, res) {
  try {
    const { id } = req.params; // ID de la clase
    const id_clase = parseInt(id, 10);
    const profesorId = req.user.id; // Del token

    // Verificar que la clase pertenezca al profesor
    const isOwner = await reporteService.verifyClaseOwnership(id_clase, profesorId);
    
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver los reportes de esta clase'
      });
    }

    const reportes = await reporteService.getReportesByClase(id_clase);

    return res.json({
      success: true,
      data: reportes
    });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    
    if (error.message === 'Clase no encontrada') {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Error al obtener reportes',
      message: error.message
    });
  }
}

// Crear un reporte manualmente (opcional)
async function createReporte(req, res) {
  try {
    const data = req.body;
    const profesorId = req.user.id;

    // Verificar que la clase pertenezca al profesor
    const isOwner = await reporteService.verifyClaseOwnership(data.id_clase, profesorId);
    
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para crear reportes en esta clase'
      });
    }

    const reporte = await reporteService.createReporte(data);

    return res.status(201).json({
      success: true,
      message: 'Reporte creado exitosamente',
      data: reporte
    });
  } catch (error) {
    console.error('Error al crear reporte:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al crear reporte',
      message: error.message
    });
  }
}

// Obtener un reporte por ID
async function getReporteById(req, res) {
  try {
    const { id } = req.params;
    const reporteId = parseInt(id, 10);
    const profesorId = req.user.id;

    const reporte = await reporteService.getReporteById(reporteId);

    if (!reporte) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar propiedad a través de la clase del reporte
    if (reporte.Clase.profesor_id !== profesorId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este reporte'
      });
    }

    return res.json({
      success: true,
      data: reporte
    });
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener reporte',
      message: error.message
    });
  }
}

export default {
  getReportesByClase,
  createReporte,
  getReporteById
};
