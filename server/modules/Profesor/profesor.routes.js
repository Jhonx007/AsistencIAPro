import { Router } from "express";
import profesorController from "./profesor.controller.js";
import { validateData, validateParams } from "../../middlewares/validator.js";
import { 
  createProfesorSchema, 
  updateProfesorSchema, 
  idParamSchema
} from "./profesor.validator.js";

const router = Router();

// GET /profesores - Obtener todos los profesores
router.get("/", profesorController.getAll);

// GET /profesores/:id - Obtener un profesor por ID
router.get("/:id", validateParams(idParamSchema), profesorController.getById);

// POST /profesores - Crear un nuevo profesor (con validación)
router.post("/", validateData(createProfesorSchema), profesorController.create);

// PUT /profesores/:id - Actualizar un profesor (incluye email y contraseña)
router.put(
  "/:id",
  validateParams(idParamSchema),
  validateData(updateProfesorSchema),
  profesorController.update
);

// DELETE /profesores/:id - Eliminar un profesor
router.delete("/:id", validateParams(idParamSchema), profesorController.deleteProfesor);

export default router;