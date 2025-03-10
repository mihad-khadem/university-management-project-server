// course controller

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import CourseServices from "./course.service";

// create course
const createCourse = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await CourseServices.createCourseIntoDB(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});
// get all courses
const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Courses fetched successfully",
    data: result,
  });
});
// get single course
const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);
  console.log(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course fetched successfully",
    data: result,
  });
});
// update course
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await CourseServices.updateCourseIntoDB(id, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});
// assign faculty
const assignFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  console.log(courseId);
  const payload = req.body.faculties;
  const result = await CourseServices.assignFacultiesToCourseDB(
    courseId,
    payload
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faculties assigned successfully",
    data: result,
  });
});
// Remove faculties from course
const removeFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const payload = req.body.faculties;
  const result = await CourseServices.removeFacultiesFromCourseFromDB(
    courseId,
    payload
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faculties removed successfully",
    data: result,
  });
});
// delete course
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course deleted successfully",
  });
});

export const CourseController = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFaculties,
  removeFaculties,
};
