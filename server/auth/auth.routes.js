import { Router } from "express";
import authController from "./auth.controller.js";
import { validateData } from "../middlewares/validator.js";
import { loginSchema, registerSchema } from "./auth.validator.js";

const router = Router();


router.post("/register", validateData(registerSchema), async (req, res) => {
  try {
    const result = await authController.register(req.body);

    res.status(201).json({
      success: true,
      message: "Profesor registrado exitosamente",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/login", validateData(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authController.login(email, password);

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
