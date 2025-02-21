import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { semesterRegistrationController } from "./semesterRegistration.controller";

const router = express.Router();

// create semester registration
router.post(
  "/create-semester-registration",
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema
  ),
  semesterRegistrationController.createSemesterRegistration
);
// get all semester registration
router.get("/", semesterRegistrationController.getAllSemesterRegistrations);

// get single semester registration
router.get("/:id", semesterRegistrationController.getSemesterRegistrationById);
// update single semester registration
router.patch(
  "/:id",
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema
  ),
  semesterRegistrationController.updateSemesterRegistrationById
);
// delete single semester registration
router.delete(
  "/:id",
  semesterRegistrationController.deleteSemesterRegistrationById
);

export const semesterRegistrationRoutes = router;
