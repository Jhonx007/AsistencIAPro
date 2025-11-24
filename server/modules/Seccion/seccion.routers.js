// Rutas para el módulo de Sección
import { Router } from "express"
import seccionController from "./seccion.controller.js"
import {
  createSeccionSchema,
  updateSeccionSchema,
  idSeccionSchema,
} from "./seccion.validator.js"
import { validateData, validateParams } from "../../middlewares/validator.js"

const router = Router()

// POST /api/secciones/
router.post(
  "/",
  validateData(createSeccionSchema),
  seccionController.createSeccion
)

// GET /api/secciones
router.get(
  "/",
  seccionController.getAllSeccion
)

// GET /api/secciones/:id
router.get(
  "/:id",
  validateParams(idSeccionSchema),
  seccionController.getByIdSeccion
)

// PATCH /api/secciones/:id
router.patch(
  "/:id",
  validateParams(idSeccionSchema),
  validateData(updateSeccionSchema),
  seccionController.updateSeccion
)

// DELETE /api/secciones/:id
router.delete(
  "/:id",
  validateParams(idSeccionSchema),
  seccionController.deleteSeccion
)

export default router
