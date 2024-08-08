import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { AdminControllers } from "./admin.controller";
import { updateAdminValidationSchema } from "./admin.validation";
// Admin routes
const router = express.Router();

router.get("/", AdminControllers.getAllAdmins);

router.get("/:id", AdminControllers.getSingleAdmin);

router.patch(
  "/:id",
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin
);

router.delete("/:adminId", AdminControllers.deleteAdmin);

export const adminRoutes = router;
