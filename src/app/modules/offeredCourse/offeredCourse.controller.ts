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

// offered course controller export
export const OfferedCourseController = {
  createOfferedCourse,
};
