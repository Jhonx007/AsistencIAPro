import prisma from "../../../config/prisma.js"

class ClaseService {
  // Crear una nueva clase (y sección)
  async createClaseService(data) {
    try {
      const result = await prisma.$transaction(async (prisma) => {
        // 1. Crear la Sección
        const seccion = await prisma.seccion.create({
          data: {
            codigo: data.codigo,
            semestre: data.semestre,
          },
        })

        // 2. Crear la Clase asignando profesor, materia y la sección creada
        const clase = await prisma.clases.create({
          data: {
            profesor_id: data.profesorId,
            materia_id: data.materiaId,
            seccion_id: seccion.id,
            updated_at: new Date(),
          },
          include: {
            Profesor: true,
            Materia: true,
            Seccion: true,
          },
        })

        return { seccion, clase }
      })

      return result
    } catch (error) {
      throw new Error(`Error al crear clase y sección: ${error.message}`)
    }
  }

  // Asignar una sección existente a una clase (Profesor + Materia)
  async assignClaseService(data) {
    try {
      // Verificar que la sección exista
      const seccion = await prisma.seccion.findUnique({
        where: { id: data.seccionId },
      })

      if (!seccion) {
        throw new Error("La sección especificada no existe")
      }

      // Crear la relación en Clases
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

  // Obtener todas las clases
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

  // Obtener una clase por ID
  async getByIdClaseService(id) {
    try {
      const clase = await prisma.clases.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          Profesor: true,
          Materia: true,
          Seccion: true,
        },
      })

      if (!clase) {
        throw new Error('Clase no encontrada')
      }

      return clase
    } catch (error) {
      throw new Error(`Error al obtener clase: ${error.message}`)
    }
  }

  // Obtener clases por profesor (Pivot)
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
}

export default new ClaseService()
