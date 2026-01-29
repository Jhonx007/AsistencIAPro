import prisma from "../../config/prisma.js";
import faceRecognitionService from "../../IA/faceRecognition.service.js";

// Para registrar múltiples asistencias a la vez y generar reporte automático
async function registerAsistencia(data) {
  // Usamos una transacción para asegurar que se guarden las asistencias Y el reporte, o nada.
  return await prisma.$transaction(async (tx) => {
    const createdAsistencias = [];
    let id_clase = null;
    let fechaAsistencia = new Date(); // Fecha actual para el reporte

    // 1. Procesar cada asistencia
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
    }

    // 2. Generar o Actualizar el Reporte
    if (id_clase) {
      // Normalizar fecha (sin hora) para buscar reporte del día
      const fechaReporte = new Date(fechaAsistencia);
      fechaReporte.setHours(0, 0, 0, 0);

      // Contar TODOS los estudiantes matriculados en la clase
      const totalMatriculados = await tx.matricula.count({
        where: {
          id_clase: id_clase
        }
      });

      // Contar TODAS las asistencias del día
      const asistenciasHoy = await tx.asistencia.findMany({
        where: {
          fecha: fechaReporte,
          Matricula: {
            id_clase: id_clase
          }
        }
      });

      const total_presentes = asistenciasHoy.filter(a => a.es_presente).length;
      // Los ausentes son todos los matriculados menos los presentes
      const total_ausentes = totalMatriculados - total_presentes;
      const total_estudiantes = totalMatriculados;

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

// Para autenticar asistencia mediante reconocimiento facial
async function authenticateAttendanceByFace(id_clase, imageBuffer) {
  // 1. Extraer descriptor facial de la imagen capturada
  const detection = await faceRecognitionService.detectFaceAndDescriptor(imageBuffer);

  if (!detection || !detection.descriptor) {
    throw new Error("No se detectó ningún rostro en la imagen");
  }

  const capturedDescriptor = detection.descriptor;

  // 2. Obtener todos los estudiantes matriculados en la clase con face_descriptor registrado
  const matriculas = await prisma.matricula.findMany({
    where: {
      id_clase: id_clase,
      Estudiante: {
        face_descriptor: {
          not: null
        }
      }
    },
    include: {
      Estudiante: {
        select: {
          id: true,
          nombres: true,
          apellidos: true,
          cedula: true,
          face_descriptor: true
        }
      },
      Clase: {
        include: {
          Materia: true,
          Seccion: true
        }
      }
    }
  });

  if (matriculas.length === 0) {
    throw new Error("No hay estudiantes con rostro registrado matriculados en esta clase");
  }

  // 3. Comparar el descriptor capturado con cada estudiante matriculado
  let matchedMatricula = null;
  let minDistance = Infinity;

  for (const matricula of matriculas) {
    const storedDescriptor = matricula.Estudiante.face_descriptor;

    // Convertir de JSON a array si es necesario
    const descriptorArray = Array.isArray(storedDescriptor)
      ? storedDescriptor
      : JSON.parse(JSON.stringify(storedDescriptor));

    const distance = faceRecognitionService.compareFaces(capturedDescriptor, descriptorArray);

    if (distance < minDistance) {
      minDistance = distance;
      matchedMatricula = matricula;
    }
  }

  // 4. Verificar si hay coincidencia (umbral de 0.6)
  const THRESHOLD = 0.6;
  if (minDistance >= THRESHOLD) {
    throw new Error("Rostro no reconocido. No se encontró coincidencia con ningún estudiante matriculado");
  }

  // 5. Verificar si ya existe asistencia para hoy en esta matrícula
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingAsistencia = await prisma.asistencia.findFirst({
    where: {
      id_matricula: matchedMatricula.id,
      fecha: today
    }
  });

  if (existingAsistencia) {
    throw new Error("Ya registraste asistencia en esta clase hoy");
  }

  // 6. Registrar la asistencia usando una transacción (igual que registerAsistencia)
  return await prisma.$transaction(async (tx) => {
    // Crear la asistencia
    const asistencia = await tx.asistencia.create({
      data: {
        id_matricula: matchedMatricula.id,
        es_presente: true,
        fecha: today
      },
      include: {
        Matricula: {
          include: {
            Estudiante: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                cedula: true
              }
            },
            Clase: {
              include: {
                Materia: true,
                Seccion: true,
                Profesor: true
              }
            }
          }
        }
      }
    });

    // 7. Actualizar o crear el reporte del día
    // Contar TODOS los estudiantes matriculados en la clase
    const totalMatriculados = await tx.matricula.count({
      where: {
        id_clase: id_clase
      }
    });

    // Contar cuántos estudiantes han registrado asistencia hoy (escaneado su rostro)
    const asistenciasHoy = await tx.asistencia.findMany({
      where: {
        fecha: today,
        Matricula: {
          id_clase: id_clase
        }
      }
    });

    // Los presentes son los que han escaneado (es_presente = true)
    const total_presentes = asistenciasHoy.filter(a => a.es_presente).length;
    // Los ausentes son todos los matriculados menos los presentes
    const total_ausentes = totalMatriculados - total_presentes;
    const total_estudiantes = totalMatriculados;

    const reporte = await tx.reporte.upsert({
      where: {
        id_clase_fecha: {
          id_clase: id_clase,
          fecha: today
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
        fecha: today,
        titulo: `Clase del ${today.toLocaleDateString('es-ES')}`,
        total_estudiantes,
        total_presentes,
        total_ausentes
      }
    });

    return {
      estudiante: matchedMatricula.Estudiante,
      asistencia,
      reporte,
      matchInfo: {
        distance: minDistance,
        threshold: THRESHOLD,
        confidence: (1 - (minDistance / THRESHOLD)) * 100
      }
    };
  }, {
    timeout: 20000
  });
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
  deleteAsistencia,
  authenticateAttendanceByFace
};