import claseService from "./clase.services.js"

class ClaseController {
  async createClase(req, res) {
    try {
      const data = await claseService.createClaseService(req.body)
      res.status(201).json({
        success: true,
        message: "Sección creada y clase asignada exitosamente",
        data: data,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async assignClase(req, res) {
    try {
      const data = await claseService.assignClaseService(req.body)
      res.status(201).json({
        success: true,
        message: "Sección asignada a clase exitosamente",
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

  async getClaseById(req, res) {
    try {
      const { id } = req.params
      const clase = await claseService.getByIdClaseService(id)
      res.status(200).json({
        success: true,
        data: clase,
      })
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getClasesByProfesor(req, res) {
    try {
      const { profesorId } = req.params
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
}

export default new ClaseController()
