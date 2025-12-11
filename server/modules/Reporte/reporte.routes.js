import { Router } from "express";
import reporteController from "./reporte.controller.js";
import { validateData, validateParams } from "../../middlewares/validator.js";
import { 
  createReporteSchema, 
  idParamSchema 
} from "./reporte.validator.js";

const router = Router();

// GET /reportes/clase/:id - Obtener historial de reportes de una clase
router.get(
  "/clase/:id", 
  validateParams(idParamSchema), 
  reporteController.getReportesByClase
);

// POST /reportes - Crear un nuevo reporte
router.post(
  "/", 
  validateData(createReporteSchema), 
  reporteController.createReporte
);

// GET /reportes/:id - Obtener un reporte específico
router.get(
  "/:id", 
  validateParams(idParamSchema), 
  reporteController.getReporteById
);

export default router;
