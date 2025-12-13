import { Router } from "express";
import multer from "multer";
import estudianteController from "./estudiante.controller.js";
import { validateData, validateParams } from "../../middlewares/validator.js";
import { createEstudianteSchema, updateEstudianteSchema, idParamSchema } from "./estudiante.validator.js";

const router = Router();

// GET /estudiantes - Obtener todos los estudiantes
router.get("/", estudianteController.getAll);

// GET /estudiantes/:id - Obtener un estudiante por ID
router.get("/:id", validateParams(idParamSchema), estudianteController.getById);

// POST /estudiantes - Crear un nuevo estudiante (con validación)
router.post("/", validateData(createEstudianteSchema), estudianteController.create);

// PUT /estudiantes/:id - Actualizar un estudiante (con validación)
router.put("/:id", validateParams(idParamSchema), validateData(updateEstudianteSchema), estudianteController.update);

// DELETE /estudiantes/:id - Eliminar un estudiante
router.delete("/:id", validateParams(idParamSchema), estudianteController.deleteEstudiante);

// PATCH /estudiantes/:id/register-face - Registrar rostro
const upload = multer({ storage: multer.memoryStorage() });
router.patch("/:id/register-face", validateParams(idParamSchema), upload.single("image"), estudianteController.registerFace);

export default router;