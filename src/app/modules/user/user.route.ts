import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import createZodStudentValidation from "../student/zod.validation";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";

const router = express.Router();

// create user api
router.post(
  "/create-student",
  validateRequest(createZodStudentValidation),
  userController.createUser
);
// create faculty

router.post(
  "/create-faculty",
  validateRequest(createFacultyValidationSchema),
  userController.createFaculty
);

// get all users
router.get("/get-all-users", userController.getAllUsers);
// get user by id
router.get("/:id", userController.getUserById);
// delete user by id
router.delete("/:id", userController.deleteUserById);

export const userRoutes = router;
