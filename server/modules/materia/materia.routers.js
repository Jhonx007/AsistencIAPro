import { Router } from "express"
import materiaController from "./materia.controller.js"
import {
  createMateriaSchema,
  updateMateriaSchema,
  idMateriaSchema,
} from "./materia.validator.js"
import { validateData, validateParams } from "../../middlewares/validator.js"

const router = Router()

router.post(
  "/",
  validateData(createMateriaSchema),
  materiaController.createMateria
)

router.get(
  "/",
  materiaController.getAllMateria
)
router.get(
  "/:id",
  validateParams(idMateriaSchema),
  materiaController.getByIdMateria
)


router.patch(
  "/:id",
  validateParams(idMateriaSchema),
  validateData(updateMateriaSchema),
  materiaController.updateMateria
)


router.delete(
  "/:id",
  validateParams(idMateriaSchema),
  materiaController.deleteMateria
)

export default router
