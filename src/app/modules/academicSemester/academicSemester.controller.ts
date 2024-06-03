// academic semester controller

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { academicSemesterServices } from "./academicSemester.service";

// create academic semester controller
const createAcademicSemester = catchAsync(async (req, res) => {
  const semesterData = req.body;
  const result = await academicSemesterServices.createAcademicSemesterInDB(
    semesterData
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Academic semester created successfully",
    data: result,
  });
});
//
export const academicSemesterControllers = {
  createAcademicSemester,
};
