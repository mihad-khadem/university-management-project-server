import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseController } from "./course.controller";

const router = express.Router();
// create route
router.post(
  "/create-course",
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse
);

// get all courses
router.get("/", CourseController.getAllCourses);
// get single
router.get("/:id", CourseController.getSingleCourse);
// update
router.patch(
  "/:id",
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourse
);
// assign faculties to course
router.put(
  "/:courseId/assign-faculties",
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.assignFaculties
);
router.delete(
  "/:courseId/remove-faculties",
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.removeFaculties
);
// delete
router.delete("/:id", CourseController.deleteCourse);
export const courseRoutes = router;
