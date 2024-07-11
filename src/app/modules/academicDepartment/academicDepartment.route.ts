// Academic department route
import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { AcademicDepartmentValidations } from "./academicDepartment.validation";
import { academicDepartmentControllers } from "./academicDepartment.controller";

const router = express.Router();

// routes

// create  academic department route
router.post(
  "/create-department",
  // validateRequest(
  //   AcademicDepartmentValidations.createAcademicDepartmentValidationSchema
  // ),
  academicDepartmentControllers.createAcademicDepartment
);
// get all academic departments
router.get("/", academicDepartmentControllers.getAllAcademicDepartments);
// get single academic department
router.get(
  "/:id",
  academicDepartmentControllers.getSingleAcademicDepartmentById
);
// update academic department
router.patch(
  "/:id",
  validateRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema
  ),
  academicDepartmentControllers.updateAcademicDepartmentById
);
// delete academic department
router.delete(
  "/:id",
  academicDepartmentControllers.deleteAcademicDepartmentById
);
export const academicDepartmentRoutes = router;
