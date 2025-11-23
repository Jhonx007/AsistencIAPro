import { Router } from "express"
import claseController from "./clase.controller.js"
import {
  createClaseSchema,
  assignClaseSchema,
  idClaseSchema,
  profesorIdSchema,
} from "./clase.validator.js"
import { validateData, validateParams } from "../../../middlewares/validator.js"

const router = Router()

// POST /api/clases/
router.post(
  "/",
  validateData(createClaseSchema),
  claseController.createClase
)

// POST /api/clases/assign
router.post(
  "/assign",
  validateData(assignClaseSchema),
  claseController.assignClase
)

// GET /api/clases
router.get(
  "/",
  claseController.getAllClases
)

// GET /api/clases/:id
router.get(
  "/:id",
  validateParams(idClaseSchema),
  claseController.getClaseById
)

// GET /api/clases/profesor/:profesorId
router.get(
  "/profesor/:profesorId",
  validateParams(profesorIdSchema),
  claseController.getClasesByProfesor
)

export default router
