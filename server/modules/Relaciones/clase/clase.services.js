import prisma from "../../../config/prisma.js"

class ClaseService {

  async assignClaseService(data) {
    try {
      const seccion = await prisma.seccion.findUnique({
        where: { id: data.seccionId },
      })

      if (!seccion) {
        throw new Error("La sección especificada no existe")
      }

      const clase = await prisma.clases.create({
        data: {
          profesor_id: data.profesorId,
          materia_id: data.materiaId,
          seccion_id: data.seccionId,
          updated_at: new Date(),
        },
        include: {
          Profesor: true,
          Materia: true,
          Seccion: true,
        },
      })

      return clase
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error("Esta combinación de Profesor, Materia y Sección ya existe")
      }
      throw new Error(`Error al asignar clase: ${error.message}`)
    }
  }

  async getAllClaseService() {
    try {
      const clases = await prisma.clases.findMany({
        orderBy: {
          created_at: 'desc',
        },
        include: {
          Profesor: true,
          Materia: true,
          Seccion: true,
        },
      })
      return clases
    } catch (error) {
      throw new Error(`Error al obtener clases: ${error.message}`)
    }
  }

  async getClasesByProfesorService(profesorId) {
    try {
      const clases = await prisma.clases.findMany({
        where: {
          profesor_id: profesorId,
        },
        include: {
          Materia: true,
          Seccion: true,
        },
      })
      return clases
    } catch (error) {
      throw new Error(`Error al obtener clases del profesor: ${error.message}`)
    }
  }

  async deleteClaseService(id) {
    try {
      const clase = await prisma.clases.findUnique({
        where: {
          id: parseInt(id),
        },
      })

      if (!clase) {
        throw new Error('Clase no encontrada')
      }

      await prisma.clases.delete({
        where: {
          id: parseInt(id),
        },
      })

      return { message: 'Clase eliminada exitosamente' }
    } catch (error) {
      throw new Error(`Error al eliminar clase: ${error.message}`)
    }
  }
}

export default new ClaseService()
