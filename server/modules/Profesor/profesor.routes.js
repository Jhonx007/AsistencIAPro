import { Router } from "express";
import profesorController from "./profesor.controller.js";

const router = Router();

router.get("/", profesorController.getAll);
router.get("/:id", profesorController.getById);
router.post("/", profesorController.create);
router.put("/:id", profesorController.update);
router.delete("/:id", profesorController.deleteProfesor);


export default router;