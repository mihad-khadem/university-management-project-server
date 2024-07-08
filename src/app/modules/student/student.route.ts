import express from "express";
import { StudentController } from "./student.controller";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

// will call the controller
// router.post("/create-student", StudentController.createStudent);

// get all students
router.get("/", StudentController.getAllStudents);
// get student by id
router.get("/:id", StudentController.getStudentById);
// delete student by id
router.delete("/:id", StudentController.deleteStudentById);
export default router;
