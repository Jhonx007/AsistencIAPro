import { Router } from "express";
import authController from "./auth.controller.js";
import { validateData } from "../middlewares/validator.js";
import { loginSchema, registerSchema } from "./auth.validator.js";

const router = Router();


router.post("/register", validateData(registerSchema), async (req, res) => {
  const result = await authController.register(req.body);
  const { status, ...responseData } = result;
  res.status(status).json(responseData);
});

router.post("/login", validateData(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const result = await authController.login(email, password);
  const { status, ...responseData } = result;
  res.status(status).json(responseData);
});

export default router;
