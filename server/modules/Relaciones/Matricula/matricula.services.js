import prisma from "../../../config/prisma.js";

// Para obtener todas las matrículas
async function getMatriculas() {
  const matriculas = await prisma.matricula.findMany({
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
  });
  return matriculas;
}

// Para obtener una matrícula por ID
async function getMatriculaById(id) {
  const matricula = await prisma.matricula.findUnique({
    where: {
      id: id
    },
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
  });

  return matricula;
}

// Para asignar un estudiante a una clase (crear matrícula)
async function assignMatricula(data) {
  const matriculaCreated = await prisma.matricula.create({
    data: {
      id_clase: data.id_clase,
      id_estudiante: data.id_estudiante
    },
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
  });

  return matriculaCreated;
}

// Para eliminar una matrícula por ID
async function deleteMatricula(id) {
  await prisma.matricula.delete({
    where: {
      id: id
    }
  });

  // No retorna nada, solo ejecuta la eliminación
}

export default {
  getMatriculas,
  getMatriculaById,
  assignMatricula,
  deleteMatricula
};
