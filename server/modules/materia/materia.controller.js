
import materiaService from "./materia.service.js"

class MateriaController {


  // Obtener todas las materias
  async getAllMateria(res) {
    try {
      const materias = await materiaService.getAllMateriaService()
      return res.status(200).json({
        success: true,
        message: "Materias obtenidas exitosamente",
        data: materias,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  //crear una materia
  async createMateria(req, res) {
    try {
      const materia = await materiaService.createMateriaService(req.body)
      return res.status(201).json({
        success: true,
        message: "Materia creada exitosamente",
        data: materia,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  // Obtener una materia por ID
  async getByIdMateria(req, res) {
    try {
      const materia = await materiaService.getByIdMateriaService(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Materia obtenida exitosamente",
        data: materia,
      })
    } catch (error) {
      const statusCode = error.message.includes("no encontrada") ? 404 : 500
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  // Actualizar una materia
  async updateMateria(req, res) {
    try {
      const materia = await materiaService.updateMateriaService(
        req.params.id,
        req.body
      );
      return res.status(200).json({
        success: true,
        message: "Materia actualizada exitosamente",
        data: materia,
      })
    } catch (error) {
      const statusCode = error.message.includes("no encontrada") ? 404 : 500
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  // Eliminar una materia
  async deleteMateria(req, res) {
    try {
      const materia = await materiaService.deleteMateriaService(req.params.id)
      return res.status(200).json({
        success: true,
        message: "Materia eliminada exitosamente",
        data: materia,
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

export default new MateriaController();
