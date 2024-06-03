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
// get all academic semesters
const getAllSemesters = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemestersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic semesters fetched successfully",
    data: result,
  });
});
// get by id
const getSemesterById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await academicSemesterServices.getAcademicSemesterByIdFromDB(
    id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic semester fetched successfully",
    data: result,
  });
});
// update using patch
const updateSemesterById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await academicSemesterServices.updateAcademicSemesterInDB(
    id,
    payload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic semester updated successfully",
    data: result,
  });
});
// delete by id
const deleteSemesterById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await academicSemesterServices.deleteAcademicSemesterFromDB(
    id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic semester deleted successfully",
    data: result,
  });
});
export const academicSemesterControllers = {
  createAcademicSemester,
  getAllSemesters,
  getSemesterById,
  updateSemesterById,
  deleteSemesterById,
};
