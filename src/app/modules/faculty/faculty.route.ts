import express from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../../middleware/validateRequest";
import { updateFacultyValidationSchema } from "./faculty.validation";
import validateAuthToken from "../../middleware/auth";
import { USER_ROLES } from "../Auth/auth.constant";
const router = express.Router();
// Faculty Routes
router.get(
  "/",
  validateAuthToken(USER_ROLES.admin),
  FacultyControllers.getAllFaculties
);

router.get("/:id", FacultyControllers.getSingleFaculty);

router.patch(
  "/:id",
  validateAuthToken(USER_ROLES.admin),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty
);

router.delete("/:id", FacultyControllers.deleteFaculty);

export const facultyRoutes = router;
