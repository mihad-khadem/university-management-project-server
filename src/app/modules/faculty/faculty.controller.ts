import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { facultyServices } from "./faculty.service";

// get single faculty controller
const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await facultyServices.getSingleFacultyFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single faculty fetched successfully",
    data: result,
  });
});
// get all faculty controller
const getAllFaculties = catchAsync(async (req, res) => {
  const result = await facultyServices.getAllFacultiesFromDB(req.query);
  console.log(req.cookies);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All faculties fetched successfully",
    data: result,
  });
});
// update controller

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;
  const result = await facultyServices.updateFacultyIntoDB(id, faculty);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "faculty updated successfully",
    data: result,
  });
});
// delete

const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await facultyServices.deleteFacultyFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "faculty deleted successfully",
    data: result,
  });
});

export const FacultyControllers = {
  getSingleFaculty,
  getAllFaculties,
  updateFaculty,
  deleteFaculty,
};
