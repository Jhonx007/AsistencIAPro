import prisma from "../../config/prisma.js";

// Para registrar múltiples asistencias a la vez
async function registerAsistencia(data) {
  const created = [];
  for (const item of data.asistencias) {
    const asistencia = await prisma.asistencia.create({
      data: {
        id_matricula: item.id_matricula,
        es_presente: item.es_presente
        // fecha se asigna automáticamente con @default(now()) en Prisma
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
    created.push(asistencia);
  }

  return created;
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