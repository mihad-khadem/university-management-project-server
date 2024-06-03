import express from "express";
import { academicFacultyControllers } from "./academicFaculty.controller";
import validateRequest from "../../middleware/validateRequest";
import { AcademicFacultyValidation } from "./academicFaculty.validation";

const router = express.Router();

// routes

// create  academic faculty
router.post(
  "/create-faculty",
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema
  ),
  academicFacultyControllers.createAcademicFaculty
);
// get all academic faculty
router.get("/", academicFacultyControllers.getAllAcademicFaculties);
// get single academic faculty
router.get("/:id", academicFacultyControllers.getSingleAcademicFacultyById);
// update single academic faculty
router.patch(
  "/:id",
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema
  ),
  academicFacultyControllers.updateAcademicFacultyById
);
// delete single academic faculty
router.delete("/:id", academicFacultyControllers.deleteAcademicFacultyById);

export const academicFacultyRoutes = router;
