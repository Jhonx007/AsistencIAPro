import { Router } from "express"
import claseController from "./clase.controller.js"
import {
  assignClaseSchema,
  profesorIdSchema,
  idClaseSchema,
} from "./clase.validator.js"
import { validateData, validateParams } from "../../../middlewares/validator.js"

const router = Router()

// POST /api/v1/clases/assing
router.post(
  "/assing",
  validateData(assignClaseSchema),
  claseController.assignClase
)

// GET /api/v1/clases
router.get(
  "/",
  claseController.getAllClases
)


// GET /api/v1/clases/profesor/:profesorId
router.get(
  "/profesor/:profesorId",
  validateParams(profesorIdSchema),
  claseController.getClasesByProfesor
)

// DELETE /api/v1/clases/:id
router.delete(
  "/:id",
  validateParams(idClaseSchema),
  claseController.deleteClase
)

export default router
