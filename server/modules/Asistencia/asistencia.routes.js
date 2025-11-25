import { Router } from "express";
import asistenciaController from "./asistencia.controller.js";
import { validateData, validateParams } from "../../middlewares/validator.js";
import { 
  registerAsistenciaSchema, 
  updateAsistenciaSchema, 
  idParamSchema,
  fechaParamSchema 
} from "./asistencia.validator.js";

const router = Router();

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
