import prisma from "../../config/prisma.js"

class SeccionService {

  async createSeccionService(data) {
    try {
      const seccion = await prisma.seccion.create({
        data: {
          codigo: data.codigo,
          semestre: data.semestre,
        },
      });
      return seccion;
    } catch (error) {
      throw new Error(`Error al crear sección: ${error.message}`)
    }
  }

  async getAllSeccionService() {
    try {
      const secciones = await prisma.seccion.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });
      return secciones;
    } catch (error) {
      throw new Error(`Error al obtener secciones: ${error.message}`)
    }
  }

  async getByIdSeccionService(id) {
    try {
      const seccion = await prisma.seccion.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          clases: {
            include: {
              Profesor: true,
              Materia: true,
            },
          },
          Matricula: {
            include: {
              Estudiante: true,
            },
          },
          Reportes: true,
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

  async updateSeccionService(id, data) {
    try {
      const seccion = await prisma.seccion.update({
        where: {
          id: parseInt(id),
        },
        data: {
          ...(data.codigo && { codigo: data.codigo }),
          ...(data.semestre && { semestre: data.semestre }),
        },
      });
      return seccion;
    } catch (error) {
      throw new Error(`Error al actualizar sección: ${error.message}`)
    }
  }

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
