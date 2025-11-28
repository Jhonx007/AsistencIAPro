import { Router } from "express";
import profesorController from "./profesor.controller.js";
import { validateData, validateParams } from "../../middlewares/validator.js";
import {
  updateProfesorSchema,
  idParamSchema
} from "./profesor.validator.js";

const router = Router();

router.get("/", profesorController.getAll);

router.get("/:id", validateParams(idParamSchema), profesorController.getById);

router.put(
  "/:id",
  validateParams(idParamSchema),
  validateData(updateProfesorSchema),
  profesorController.update
);

router.delete("/:id", validateParams(idParamSchema), profesorController.deleteProfesor);

export default router;