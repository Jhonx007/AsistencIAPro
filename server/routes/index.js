// Este es el archivo donde se importarán las rutas de los modelos
import { Router } from "express";
import profesorRoutes from "../modules/Profesor/profesor.routes.js";
import materiaRouter from '../modules/materia/materia.routers.js';
import estudianteRoutes from '../modules/Estudiante/estudiante.routes.js'

const router = Router();

router.use('/materias', materiaRouter);
router.use("/profesores", profesorRoutes);
router.use("/estudiantes", estudianteRoutes);

export default router;