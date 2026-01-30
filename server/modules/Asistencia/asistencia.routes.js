import { Router } from "express";
import multer from "multer";
import asistenciaController from "./asistencia.controller.js";
import { validateData, validateParams } from "../../middlewares/validator.js";
import {
  registerAsistenciaSchema,
  updateAsistenciaSchema,
  idParamSchema,
  fechaParamSchema,
  authenticateFaceSchema,
  claseFechaParamSchema
} from "./asistencia.validator.js";

const router = Router();

// Configurar multer para manejar uploads de imágenes en memoria
const upload = multer({ storage: multer.memoryStorage() });

// POST /asistencia/authenticate-face - Autenticar asistencia por reconocimiento facial
router.post(
  "/authenticate-face",
  upload.single("image"),
  validateData(authenticateFaceSchema),
  asistenciaController.authenticateFaceAttendance
);

// POST /asistencia - Registrar múltiples asistencias
router.post(
  "/register",
  validateData(registerAsistenciaSchema),
  asistenciaController.registerAsistencia
);

// GET /asistencia - Obtener todas las asistencias
router.get(
  "/",
  asistenciaController.getAllAsistencias
);

// GET /asistencia/matricula/:id - Obtener asistencias por matrícula
router.get(
  "/matricula/:id",
  validateParams(idParamSchema),
  asistenciaController.getAsistenciasByMatricula
);

// GET /asistencia/fecha/:fecha - Obtener asistencias por fecha
router.get(
  "/fecha/:fecha",
  validateParams(fechaParamSchema),
  asistenciaController.getAsistenciasByFecha
);

// GET /asistencia/clase/:id_clase/fecha/:fecha - Obtener detalles de asistencias de una clase en una fecha
router.get(
  "/clase/:id_clase/fecha/:fecha",
  validateParams(claseFechaParamSchema),
  asistenciaController.getAsistenciaDetails
);

// PUT /asistencia/:id - Actualizar una asistencia
router.put(
  "/:id",
  validateParams(idParamSchema),
  validateData(updateAsistenciaSchema),
  asistenciaController.updateAsistencia
);

// DELETE /asistencia/:id - Eliminar una asistencia
router.delete(
  "/:id",
  validateParams(idParamSchema),
  asistenciaController.deleteAsistencia
);

export default router;
