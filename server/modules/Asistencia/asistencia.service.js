import prisma from "../../config/prisma.js";

// Para registrar múltiples asistencias a la vez y generar reporte automático
async function registerAsistencia(data) {
  // Usamos una transacción para asegurar que se guarden las asistencias Y el reporte, o nada.
  return await prisma.$transaction(async (tx) => {
    const createdAsistencias = [];
    let id_clase = null;
    let fechaAsistencia = new Date(); // Fecha actual para el reporte

    // 1. Contadores para el reporte
    let total_presentes = 0;
    let total_ausentes = 0;

    // 2. Procesar cada asistencia
    for (const item of data.asistencias) {
      // Obtenemos la matrícula para saber la clase (solo necesitamos hacerlo una vez si asumimos misma clase)
      if (!id_clase) {
        const matricula = await tx.matricula.findUnique({
          where: { id: item.id_matricula },
          select: { id_clase: true }
        });
        if (matricula) id_clase = matricula.id_clase;
      }

      // Crear la asistencia
      const asistencia = await tx.asistencia.create({
        data: {
          id_matricula: item.id_matricula,
          es_presente: item.es_presente,
          // fecha se asigna por defecto a now()
        },
        include: {
          Matricula: {
            include: {
              Estudiante: true
            }
          }
        }
      });

      createdAsistencias.push(asistencia);

      // Actualizar contadores
      if (item.es_presente) {
        total_presentes++;
      } else {
        total_ausentes++;
      }
    }

    // 3. Generar o Actualizar el Reporte
    if (id_clase) {
      const total_estudiantes = total_presentes + total_ausentes;
      
      // Normalizar fecha (sin hora) para buscar reporte del día
      const fechaReporte = new Date(fechaAsistencia);
      fechaReporte.setHours(0, 0, 0, 0);
      
      // Usamos upsert: si existe el reporte del día, lo actualizamos; si no, lo creamos.
      const reporte = await tx.reporte.upsert({
        where: {
          id_clase_fecha: {
            id_clase: id_clase,
            fecha: fechaReporte
          }
        },
        update: {
          total_estudiantes,
          total_presentes,
          total_ausentes,
          updated_at: new Date()
        },
        create: {
          id_clase,
          fecha: fechaReporte,
          titulo: `Clase del ${fechaReporte.toLocaleDateString('es-ES')}`, // Título automático opcional
          total_estudiantes,
          total_presentes,
          total_ausentes
        }
      });
      
      // Adjuntamos el reporte a la respuesta para que el frontend lo reciba
      return {
        asistencias: createdAsistencias,
        reporte: reporte
      };
    }

    return { asistencias: createdAsistencias, reporte: null };
  }, {
    timeout: 20000 // Aumentamos timeout a 20s por latencia de red
  });
}

// Para obtener todas las asistencias
async function getAsistencias() {
  const asistencias = await prisma.asistencia.findMany({
    include: {
      Matricula: {
        include: {
          Estudiante: true,
          Clase: {
            include: {
              Profesor: true,
              Materia: true,
              Seccion: true
            }
          }
        }
      }
    },
    orderBy: {
      fecha: 'desc'
    }
  });

  return asistencias;
}

// Para obtener asistencias por matrícula
async function getAsistenciasByMatricula(id_matricula) {
  const asistenciasEstudiante = await prisma.asistencia.findMany({
    where: {
      id_matricula: id_matricula
    },
    include: {
      Matricula: {
        include: {
          Estudiante: true,
          Clase: {
            include: {
              Profesor: true,
              Materia: true,
              Seccion: true
            }
          }
        }
      }
    },
    orderBy: {
      fecha: 'desc'
    }
  });

  return asistenciasEstudiante;
}

// Para obtener asistencias por fecha
async function getAsistenciasByFecha(fecha) {
  const asistenciasFecha = await prisma.asistencia.findMany({
    where: {
      fecha: new Date(fecha)
    },
    include: {
      Matricula: {
        include: {
          Estudiante: true,
          Clase: {
            include: {
              Profesor: true,
              Materia: true,
              Seccion: true
            }
          }
        }
      }
    }
  });

  return asistenciasFecha;
}

// Para actualizar una asistencia
async function updateAsistencia(id, data) {
  const asistencia = await prisma.asistencia.update({
    where: {
      id: id
    },
    data: data,
    include: {
      Matricula: {
        include: {
          Estudiante: true,
          Clase: true
        }
      }
    }
  });

  return asistencia;
}

// Para eliminar una asistencia
async function deleteAsistencia(id) {
  await prisma.asistencia.delete({
    where: {
      id: id
    }
  });
}

export default {
  registerAsistencia,
  getAsistencias,
  getAsistenciasByMatricula,
  getAsistenciasByFecha,
  updateAsistencia,
  deleteAsistencia
};