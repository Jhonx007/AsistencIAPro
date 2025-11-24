import { Router } from "express";
import matriculaController from "./matricula.controller.js";
import { validateData, validateParams } from "../../../middlewares/validator.js";
import { assignMatriculaSchema, idParamSchema } from "./matricula.validator.js";

const router = Router();

// GET /matricula - Obtener todas las matrículas
router.get("/", matriculaController.getAllMatriculas);

// GET /matricula/:id - Obtener una matrícula por ID
router.get("/:id", validateParams(idParamSchema), matriculaController.getMatriculaById);

// POST /matricula/assign - Asignar un estudiante a una sección (crear matrícula)
router.post("/assign", validateData(assignMatriculaSchema), matriculaController.assignMatricula);

// DELETE /matricula/:id - Eliminar una matrícula
router.delete("/:id", validateParams(idParamSchema), matriculaController.deleteMatricula);

export default router;
