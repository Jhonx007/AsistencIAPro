import claseService from "./clase.services.js"

class ClaseController {

  async assignClase(req, res) {
    try {
      const profesorId = req.user.id; // Extraer del token de autenticación
      const data = await claseService.assignClaseService({
        ...req.body,
        profesorId
      })
      res.status(201).json({
        success: true,
        message: "asignacion exitosa",
        data: data,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getAllClases(req, res) {
    try {
      const clases = await claseService.getAllClaseService()
      res.status(200).json({
        success: true,
        data: clases,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getClasesByProfesor(req, res) {
    try {
      const profesorId = req.user.id;
      const clases = await claseService.getClasesByProfesorService(profesorId)
      res.status(200).json({
        success: true,
        data: clases
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

  async deleteClase(req, res) {
    try {
      const { id } = req.params
      const result = await claseService.deleteClaseService(id)
      res.status(200).json({
        success: true,
        message: result.message
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  /**
   * Obtiene las clases del profesor agrupadas por materia
   * Retorna un JSON donde cada materia tiene sus secciones
   */
  async getClasesByProfesorGrouped(req, res) {
    try {
      const profesorId = req.user.id;
      const clasesGrouped = await claseService.getClasesByProfesorGroupedService(profesorId)
      res.status(200).json({
        success: true,
        data: clasesGrouped
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }
}

export default new ClaseController()
