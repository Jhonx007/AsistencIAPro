
import { Router } from "express";
import authRoutes from "../auth/auth.routes.js";
import profesorRoutes from "../modules/Profesor/profesor.routes.js";
import materiaRouter from '../modules/materia/materia.routers.js';
import seccionRouter from '../modules/Seccion/seccion.routers.js';
import claseRouter from '../modules/Relaciones/clase/clase.routers.js';
import matriculaRoutes from "../modules/Relaciones/Matricula/matricula.routes.js";
import estudianteRoutes from '../modules/Estudiante/estudiante.routes.js';
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = Router();

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas
router.use('/clases', verifyToken, claseRouter);
router.use('/materias', verifyToken, materiaRouter);
router.use('/secciones', verifyToken, seccionRouter);
router.use('/matricula', verifyToken, matriculaRoutes);
router.use('/estudiantes', verifyToken, estudianteRoutes);
router.use("/profesores", verifyToken, profesorRoutes);

export default router;