import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { semesterRegistrationService } from "./semesterRegistration.service";

// create new semester registration
const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await semesterRegistrationService.createSemesterRegistrationInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester registration created successfully",
    data: result,
  });
});
// get all semester registrations
const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const query = req.query;
  const result =
    await semesterRegistrationService.getAllSemesterRegistrationsFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Semester registrations fetched successfully",
    data: result,
  });
});
// get by id
const getSemesterRegistrationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await semesterRegistrationService.getSingleSemesterRegistrationFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester registration fetched successfully",
    data: result,
  });
});
// update by id
const updateSemesterRegistrationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await semesterRegistrationService.updateSemesterRegistrationInDB(
      id,
      req.body
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester registration updated successfully",
    data: result,
  });
});

// delete by id
const deleteSemesterRegistrationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await semesterRegistrationService.deleteSemesterRegistrationFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester registration deleted successfully",
    data: result,
  });
});

export const semesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSemesterRegistrationById,
  updateSemesterRegistrationById,
  deleteSemesterRegistrationById,
};
