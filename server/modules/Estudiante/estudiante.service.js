import prisma from "../../config/prisma.js";
import faceRecognitionService from "../../IA/faceRecognition.service.js";

// Para obtener todos los estudiantes
async function getEstudiantes() {
  const estudiantes = await prisma.estudiante.findMany();
  return estudiantes;
}

// Para obtener a un estudiante por id
async function getEstudianteById(id) {
  const estudiante = await prisma.estudiante.findUnique({
    where: {
      id: id
    }
  });

  return estudiante;
}

// Para crear un estudiante
async function createEstudiante(data) {
  const estudianteCreated = await prisma.estudiante.create({
    data: data
  });

  return estudianteCreated;
}

// Para actualizar un estudiante por el id
async function updateEstudiante(id, data) {
  const estudianteUpdated = await prisma.estudiante.update({
    where: {
      id: id
    },
    data: data
  });

  return estudianteUpdated;
}

// Para eliminar a un estudiante por el id
async function deleteEstudiante(id) {

  const estudianteDeleted = await prisma.estudiante.delete({
    where: {
      id: id
    }
  });

  return estudianteDeleted;
}

// Para registrar el rostro de un estudiante
async function registerFaceService(id, imageBuffer) {
  // 1. Detectar rostro
  const detection = await faceRecognitionService.detectFaceAndDescriptor(imageBuffer);

  if (!detection) {
    throw new Error("No se detectó ningún rostro en la imagen");
  }

  // 2. Actualizar BD
  const estudianteUpdated = await prisma.estudiante.update({
    where: { id: parseInt(id) },
    data: {
      face_descriptor: detection.descriptor
    }
  });

  return estudianteUpdated;
}

export default {
  getEstudiantes,
  getEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  registerFaceService
}