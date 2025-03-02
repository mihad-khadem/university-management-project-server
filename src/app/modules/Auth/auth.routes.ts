// auth routes
import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

export const authRoutes = router;
