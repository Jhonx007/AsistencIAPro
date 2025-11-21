// Rutas para el módulo de Materia
import { Router } from "express"
import materiaController from "./materia.controller.js"
import {
  createMateriaSchema,
  updateMateriaSchema,
  idMateriaSchema,
} from "./materia.validator.js"
import { validateData, validateParams } from "../../middlewares/validator.js"

const router = Router()

// POST /api/materias/
router.post(
  "/",
  validateData(createMateriaSchema),
  materiaController.createMateria
)

// GET /api/materias
router.get(
  "/",
  materiaController.getAllMateria
)

// GET /api/materias/:id
router.get(
  "/:id",
  validateParams(idMateriaSchema),
  materiaController.getByIdMateria
)


// PATCH /api/materias/:id
router.patch(
  "/:id",
  validateParams(idMateriaSchema),
  validateData(updateMateriaSchema),
  materiaController.updateMateria
)


// DELETE /api/materias/:id
router.delete(
  "/:id",
  validateParams(idMateriaSchema),
  materiaController.deleteMateria
)

export default router
