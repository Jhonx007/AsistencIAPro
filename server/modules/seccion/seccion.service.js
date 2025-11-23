
import prisma from "../../config/prisma.js"

class SeccionService {
  // Crear una nueva sección
  async createSeccionService(data) {
    try {
      const seccion = await prisma.seccion.create({
        data: {
          id_materia: data.id_materia,
          codigo: data.codigo,
          semestre: data.semestre,
        },
        include: {
          Materia: true, // Incluir la materia relacionada
        },
      });
      return seccion;
    } catch (error) {
      throw new Error(`Error al crear sección: ${error.message}`)
    }
  }

  // Obtener todas las secciones
  async getAllSeccionService() {
    try {
      const secciones = await prisma.seccion.findMany({
        orderBy: {
          created_at: 'desc',
        },
        include: {
          Materia: true, // Incluir la materia relacionada
        },
      });
      return secciones;
    } catch (error) {
      throw new Error(`Error al obtener secciones: ${error.message}`)
    }
  }

  // Obtener una sección por ID
  async getByIdSeccionService(id) {
    try {
      const seccion = await prisma.seccion.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          Materia: true, // Incluir la materia relacionada
          Profesor_Seccion: {
            include: {
              Profesor: true, // Incluir los profesores asignados
            },
          },
          Matricula: {
            include: {
              Estudiante: true, // Incluir los estudiantes matriculados
            },
          },
          Reportes: true, // Incluir los reportes de la sección
        },
      });

      if (!seccion) {
        throw new Error('Sección no encontrada');
      }

      return seccion;
    } catch (error) {
      throw new Error(`Error al obtener sección: ${error.message}`)
    }
  }

  // Actualizar una sección
  async updateSeccionService(id, data) {
    try {
      const seccion = await prisma.seccion.update({
        where: {
          id: parseInt(id),
        },
        data: {
          ...(data.id_materia && { id_materia: data.id_materia }),
          ...(data.codigo && { codigo: data.codigo }),
          ...(data.semestre && { semestre: data.semestre }),
        },
        include: {
          Materia: true, // Incluir la materia relacionada
        },
      });
      return seccion;
    } catch (error) {
      throw new Error(`Error al actualizar sección: ${error.message}`)
    }
  }

  // Eliminar una sección
  async deleteSeccionService(id) {
    try {
      const seccion = await prisma.seccion.delete({
        where: {
          id: parseInt(id),
        },
      });
      return seccion;
    } catch (error) {
      throw new Error(`Error al eliminar sección: ${error.message}`)
    }
  }
}

export default new SeccionService()
