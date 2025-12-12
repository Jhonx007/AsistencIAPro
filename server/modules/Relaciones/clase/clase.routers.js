import { Router } from "express"
import claseController from "./clase.controller.js"
import {
  assignClaseSchema,
  idClaseSchema,
} from "./clase.validator.js"
import { validateData, validateParams } from "../../../middlewares/validator.js"

const router = Router()

router.post(
  "/assign",
  validateData(assignClaseSchema),
  claseController.assignClase
)

router.get(
  "/",
  claseController.getAllClases
)

router.get(
  "/myclasses",
  claseController.getClasesByProfesor
)

// Nueva ruta: Obtener clases agrupadas por materia
router.get(
  "/myclasses/grouped",
  claseController.getClasesByProfesorGrouped
)

router.delete(
  "/:id",
  validateParams(idClaseSchema),
  claseController.deleteClase
)

router.get(
  "/:id/estudiantes",
  validateParams(idClaseSchema),
  claseController.getEstudiantesByClase
)

export default router
