import express, { RequestHandler } from "express";
import { StudentServices } from "./student-service";
import { TStudent } from "./student.interface";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync"; // Import the catchAsync utility

// Handler to get all students
const getAllStudents: RequestHandler = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await StudentServices.getAllStudentsFromDB(query);
  sendResponse<TStudent[]>(res, {
    success: true,
    message: "Students fetched successfully",
    data: result,
  });
});

// Handler to get a student by ID
const getStudentById = catchAsync(async (req, res) => {
  const { id } = req.params; // Use 'id' instead of 'studentId'
  // console.log("from controller : ", id);

  const result = await StudentServices.getStudentById(id);
  sendResponse(res, {
    success: true,
    message: "Student fetched by id",
    data: result,
  });
});

// Handler to delete a student by ID
const deleteStudentById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await StudentServices.deleteStudentFromDB(id);
  sendResponse<TStudent>(res, {
    success: true,
    message: "Student deleted successfully",
  });
});

export const StudentController = {
  getAllStudents,
  getStudentById,
  deleteStudentById,
};
