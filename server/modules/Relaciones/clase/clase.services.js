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

  /**
   * Obtiene las clases de un profesor agrupadas por materia
   * Ejemplo: Si das Matemática 2 en D1 y D2, retorna:
   * {
   *   "Matemática 2": {
   *     materia_id: 1,
   *     secciones: [
   *       { seccion_id: 1, codigo: "D1", semestre: "2024-1", clase_id: 10 },
   *       { seccion_id: 2, codigo: "D2", semestre: "2024-1", clase_id: 11 }
   *     ]
   *   }
   * }
   */
  async getClasesByProfesorGroupedService(profesorId) {
    try {
      // Obtener todas las clases del profesor con sus relaciones
      const clases = await prisma.clases.findMany({
        where: {
          profesor_id: profesorId,
        },
        include: {
          Materia: true,
          Seccion: true,
        },
        orderBy: [
          { Materia: { nombre: 'asc' } },
          { Seccion: { codigo: 'asc' } }
        ]
      })

      // Agrupar por materia
      const grouped = {}

      for (const clase of clases) {
        const materiaNombre = clase.Materia.nombre

        // Si la materia no existe en el objeto, crearla
        if (!grouped[materiaNombre]) {
          grouped[materiaNombre] = {
            secciones: []
          }
        }

        // Agregar la sección a la materia
        grouped[materiaNombre].secciones.push({
          seccion_id: clase.Seccion.id,
          codigo: clase.Seccion.codigo,
          semestre: clase.Seccion.semestre,

        })
      }

      return grouped
    } catch (error) {
      throw new Error(`Error al obtener clases agrupadas del profesor: ${error.message}`)
    }
  }

  async getEstudiantesByClaseService(claseId, profesorId) {
    try {
      // 1. Verificar primero si la clase existe y pertenece al profesor
      const clase = await prisma.clases.findUnique({
        where: {
          id: parseInt(claseId)
        }
      });

      if (!clase) {
        throw new Error('Clase no encontrada');
      }

      if (clase.profesor_id !== profesorId) {
        throw new Error('No tienes permiso para acceder a esta clase'); // Mensaje de seguridad
      }

      // 2. Si es el dueño, buscamos los estudiantes
      const matriculas = await prisma.matricula.findMany({
        where: {
          id_clase: parseInt(claseId)
        },
        include: {
          Estudiante: true
        },
        orderBy: {
          Estudiante: {
            apellidos: 'asc'
          }
        }
      });

      // Mapear para devolver una estructura limpia
      return matriculas.map(m => ({
        id_matricula: m.id,
        estudiante: m.Estudiante
      }));
    } catch (error) {
      // Propagar el error tal cual para manejar el 403 en el controlador si es necesario
      throw error;
    }
  }
}

export default new ClaseService()
