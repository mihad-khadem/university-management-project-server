// Offered Course Controller

import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { OfferedCourseService } from "./offeredCourse.service";

// create OfferedCourse

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseService.createOfferedCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Offered Course created successfully",
    data: result,
  });
});
// get all offered courses
const getAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseService.getAllOfferedCoursesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All offered courses fetched successfully",
    data: result,
  });
});

// get offered course by id
const getOfferedCourseById = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseService.getOfferedCourseByIdFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered course fetched successfully",
    data: result,
  });
});
// update offered course
const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseService.updateOfferedCourseIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered course updated successfully",
    data: result,
  });
});
// delete offered course
const deleteOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseService.deleteOfferedCourseFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered course deleted successfully",
    data: result,
  });
});
// offered course controller export
export const OfferedCourseController = {
  createOfferedCourse,
  getAllOfferedCourses,
  getOfferedCourseById,
  updateOfferedCourse,
  deleteOfferedCourse,
};
