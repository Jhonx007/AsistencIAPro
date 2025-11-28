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

router.post(
  "/",
  validateData(createSeccionSchema),
  seccionController.createSeccion
)

router.get(
  "/",
  seccionController.getAllSeccion
)
router.get(
  "/:id",
  validateParams(idSeccionSchema),
  seccionController.getByIdSeccion
)

router.patch(
  "/:id",
  validateParams(idSeccionSchema),
  validateData(updateSeccionSchema),
  seccionController.updateSeccion
)

router.delete(
  "/:id",
  validateParams(idSeccionSchema),
  seccionController.deleteSeccion
)

export default router
