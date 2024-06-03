// academic faculty controller

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { academicFacultyServices } from "./academicFaculty.service";
import { TAcademicFaculty } from "./academicFaculty.interface";

// create new academic faculty
const createAcademicFaculty = catchAsync(async (req, res) => {
  const academicFacultyData: TAcademicFaculty = req.body;
  const result =
    academicFacultyServices.createAcademicFaculty(academicFacultyData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Academic faculty created successfully",
    data: result,
  });
});
// get all academic faculty
const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = academicFacultyServices.getAllAcademicFaculties();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic faculties fetched successfully",
    data: result,
  });
});
// get by id
const getSingleAcademicFacultyById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = academicFacultyServices.getSingleAcademicFaculty(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic faculty fetched successfully",
    data: result,
  });
});
// update by id
const updateAcademicFacultyById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const result = academicFacultyServices.updateAcademicFaculty(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic faculty updated successfully",
    data: result,
  });
});
// delete by id
const deleteAcademicFacultyById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = academicFacultyServices.deleteAcademicFaculty(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic faculty deleted successfully",
  });
});
// exports

export const academicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFacultyById,
  updateAcademicFacultyById,
  deleteAcademicFacultyById,
};
