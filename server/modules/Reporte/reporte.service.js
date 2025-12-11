import prisma from "../../config/prisma.js";

// Obtener reportes de una clase específica
async function getReportesByClase(id_clase) {
  const reportes = await prisma.reporte.findMany({
    where: {
      id_clase: id_clase
    },
    orderBy: {
      fecha: 'desc'
    },
    include: {
      Clase: {
        include: {
          Materia: true,
          Seccion: true
        }
      }
    }
  });

  return reportes;
}

// Crear un nuevo reporte
async function createReporte(data) {
  // Verificar si ya existe un reporte para esta fecha y clase
  const existingReporte = await prisma.reporte.findUnique({
    where: {
      id_clase_fecha: {
        id_clase: data.id_clase,
        fecha: new Date(data.fecha)
      }
    }
  });

  if (existingReporte) {
    throw new Error('Ya existe un reporte para esta fecha en esta clase');
  }
  
  const reporte = await prisma.reporte.create({
    data: {
      id_clase: data.id_clase,
      fecha: new Date(data.fecha),
      titulo: data.titulo,
      total_estudiantes: data.total_estudiantes,
      total_presentes: data.total_presentes,
      total_ausentes: data.total_ausentes
    }
  });

  return reporte;
}

// Obtener un reporte por ID
async function getReporteById(id) {
  const reporte = await prisma.reporte.findUnique({
    where: {
      id: id
    },
    include: {
      Clase: {
        include: {
          Materia: true,
          Seccion: true,
          Profesor: true
        }
      }
    }
  });

  return reporte;
}

// Eliminar un reporte
async function deleteReporte(id) {
  await prisma.reporte.delete({
    where: {
      id: id
    }
  });
}

// Verificar si una clase pertenece a un profesor
async function verifyClaseOwnership(id_clase, id_profesor) {
  const clase = await prisma.clases.findUnique({
    where: {
      id: id_clase
    },
    select: {
      profesor_id: true
    }
  });

  if (!clase) {
    throw new Error('Clase no encontrada');
  }

  return clase.profesor_id === id_profesor;
}

export default {
  getReportesByClase,
  createReporte,
  getReporteById,
  deleteReporte,
  verifyClaseOwnership
};
