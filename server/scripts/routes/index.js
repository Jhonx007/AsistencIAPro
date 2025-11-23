// Este es el archivo donde se importarán las rutas de los modelos
import { Router } from "express";
import profesorRoutes from "../../modules/Profesor/profesor.routes.js";
import materiaRouter from '../../modules/materia/materia.routers.js';
import seccionRouter from '../../modules/seccion/seccion.routers.js';
import claseRouter from '../../modules/relaciones/clase/clase.routers.js';

const router = Router();

router.use('/materias', materiaRouter);
router.use("/profesores", profesorRoutes);
router.use('/secciones', seccionRouter);
router.use('/clases', claseRouter);

export default router;