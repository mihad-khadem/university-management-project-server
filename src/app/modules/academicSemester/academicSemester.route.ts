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
// get all academic semesters
router.get("/", academicSemesterControllers.getAllSemesters);
// get academic semester by id
router.get("/:id", academicSemesterControllers.getSemesterById);
// update academic semester by id
router.patch(
  "/:id",
  validateRequest(academicSemesterValidations.updateAcademicSemesterValidation),
  academicSemesterControllers.updateSemesterById
);
// delete academic semester by id
router.delete("/:id", academicSemesterControllers.deleteSemesterById);

export const academicSemesterRoutes = router;
