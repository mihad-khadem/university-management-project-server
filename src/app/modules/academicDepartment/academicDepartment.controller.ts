// academic department controller

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { academicDepartmentServices } from "./academicDepartment.service";
// create new academic department
const createAcademicDepartment = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await academicDepartmentServices.createAcademicDepartmentInDB(
    payload
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Academic department created successfully",
    data: result,
  });
});
//  get all academic department
const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.getAllAcademicDepartmentsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Academic departments fetched successfully",
    data: result,
  });
});

// get by id
const getSingleAcademicDepartmentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await academicDepartmentServices.getSingleAcademicDepartmentFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Academic department fetched successfully",
    data: result,
  });
});

// update by id
const updateAcademicDepartmentById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await academicDepartmentServices.updateAcademicDepartmentInDB(
    id,
    payload
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Academic department updated successfully",
    data: result,
  });
});

const deleteAcademicDepartmentById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await academicDepartmentServices.deleteAcademicDepartmentInDB(
    id
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
  });
});
export const academicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartmentById,
  updateAcademicDepartmentById,
  deleteAcademicDepartmentById,
};
