// Offered Course Routes

import { Router } from "express";
import { OfferedCourseController } from "./offeredCourse.controller";
import validateRequest from "../../middleware/validateRequest";
import { OfferedCourseValidations } from "./offeredCourse.validation";
// import OfferedCourseController from "./offeredCourse.controller";

const router = Router();
// create offered course
router.post(
  "/create-offered-course",
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse
);
// Get all offered courses
// router.get("/", OfferedCourseController.getAllOfferedCourses);

// Get offered course by id
// router.get("/:id", OfferedCourseController.getOfferedCourseById);

export const offeredCourseRoutes = router;
