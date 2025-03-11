// auth routes
import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import validateAuthToken from "../../middleware/auth";
import { USER_ROLES } from "./auth.constant";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);
// password reset
router.post(
  "/reset-password",
  validateAuthToken(USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.resetPassword
);

export const authRoutes = router;
