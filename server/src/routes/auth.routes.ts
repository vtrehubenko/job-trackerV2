import { Router } from "express";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { register, login } from "../services/auth.service";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await register(email, password);
    res.status(201).json(result);
  }),
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  }),
);

export default router;
