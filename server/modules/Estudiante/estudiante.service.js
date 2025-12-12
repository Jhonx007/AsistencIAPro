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

/**
 * Actualiza un estudiante existente con datos biométricos
 * Procesa la imagen, extrae el descriptor facial y lo guarda en la base de datos
 * @param {number} id - ID del estudiante existente
 * @param {Buffer} imageBuffer - Buffer de la imagen del rostro
 * @returns {Promise<Object>} - Estudiante actualizado con datos del rostro
 */
async function enrollFace(id, imageBuffer) {
  // STORY 2 & 3: Extraer el descriptor facial
  const faceData = await faceRecognitionService.detectFaceAndDescriptor(imageBuffer);

  // STORY 4: Guardar en base de datos
  const estudianteUpdated = await prisma.estudiante.update({
    where: {
      id: id
    },
    data: {
      face_descriptor: faceData.descriptor,
      foto_url: null
    }
  });

  return {
    estudiante: estudianteUpdated,
    confidence: faceData.confidence
  };
}

export default {
  getEstudiantes,
  getEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  enrollFace
}