
import prisma from "../../config/prisma.js"

class MateriaService {
  // Crear una nueva materia
  async createMateriaService(data) {
    try {
      const materia = await prisma.materia.create({
        data: {
          nombre: data.name,
        },
      });
      return materia;
    } catch (error) {
      throw new Error(`Error al crear materia: ${error.message}`)
    }
  }

  // Obtener todas las materias
  async getAllMateriaService() {
    try {
      const materias = await prisma.materia.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });
      return materias;
    } catch (error) {
      throw new Error(`Error al obtener materias: ${error.message}`)
    }
  }

  // Obtener una materia por ID
  async getByIdMateriaService(id) {
    try {
      const materia = await prisma.materia.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          Seccion: true, // Incluir las secciones relacionadas
        },
      });

      if (!materia) {
        throw new Error('Materia no encontrada');
      }

      return materia;
    } catch (error) {
      throw new Error(`Error al obtener materia: ${error.message}`)
    }
  }

  // Actualizar una materia
  async updateMateriaService(id, data) {
    try {
      const materia = await prisma.materia.update({
        where: {
          id: parseInt(id),
        },
        data: {
          nomrbre: data.name,
        },
      });
      return materia;
    } catch (error) {
      throw new Error(`Error al actualizar materia: ${error.message}`)
    }
  }

  // Eliminar una materia
  async deleteMateriaService(id) {
    try {
      const materia = await prisma.materia.delete({
        where: {
          id: parseInt(id),
        },
      });
      return materia;
    } catch (error) {
      throw new Error(`Error al eliminar materia: ${error.message}`)
    }
  }
}

export default new MateriaService()
