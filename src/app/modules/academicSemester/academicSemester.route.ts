import express from "express";

const router = express.Router();
import { academicSemesterControllers } from "./academicSemester.controller";
import { academicSemesterValidations } from "./academicSemester.validation";
import validateRequest from "../../middleware/validateRequest";

// get all academic semesters
// create academic semester
router.post(
  "/create-semester",
  validateRequest(academicSemesterValidations.createAcademicSemesterValidation),
  academicSemesterControllers.createAcademicSemester
);

export const academicSemesterRoutes = router;
