
import seccionService from "./seccion.service.js"

class SeccionController {

  async getAllSeccion(req, res) {
    try {
      const secciones = await seccionService.getAllSeccionService()
      return res.status(200).json({
        success: true,
        message: "Secciones obtenidas exitosamente",
        data: secciones,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async createSeccion(req, res) {
    try {
      const seccion = await seccionService.createSeccionService(req.body)
      return res.status(201).json({
        success: true,
        message: "Sección creada exitosamente",
        data: seccion,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getByIdSeccion(req, res) {
    try {
      const seccion = await seccionService.getByIdSeccionService(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Sección obtenida exitosamente",
        data: seccion,
      })
    } catch (error) {
      const statusCode = error.message.includes("no encontrada") ? 404 : 500
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  async updateSeccion(req, res) {
    try {
      const seccion = await seccionService.updateSeccionService(
        req.params.id,
        req.body
      );
      return res.status(200).json({
        success: true,
        message: "Sección actualizada exitosamente",
        data: seccion,
      })
    } catch (error) {
      const statusCode = error.message.includes("no encontrada") ? 404 : 500
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  async deleteSeccion(req, res) {
    try {
      const seccion = await seccionService.deleteSeccionService(req.params.id)
      return res.status(200).json({
        success: true,
        message: "Sección eliminada exitosamente",
        data: seccion,
      })
    } catch (error) {
      const statusCode = error.message.includes("no encontrada") ? 404 : 500
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }
}

export default new SeccionController();
