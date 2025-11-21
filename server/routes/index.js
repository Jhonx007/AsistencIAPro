// Este es el archivo donde se importarán las rutas de los modelos
import { Router } from "express";
import profesorRoutes from "../modules/Profesor/profesor.routes.js";

const router = Router();

router.use("/profesores", profesorRoutes);

export default router;