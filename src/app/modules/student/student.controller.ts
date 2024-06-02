import { NextFunction, Request, Response } from "express";
import { StudentServices } from "./student-service";
import { TStudent } from "./student.interface";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync"; // Import the catchAsync utility

// Handler to get all students
const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentServices.getAllStudentsFromDB();
  sendResponse<TStudent[]>(res, {
    success: true,
    message: "Students fetched successfully",
    data: result,
  });
});

// Handler to get a student by ID
const getStudentById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await StudentServices.getStudentById(id);
  sendResponse<TStudent[]>(res, {
    success: true,
    message: "Student fetched by id",
    data: result,
  });
});

// Handler to delete a student by ID
const deleteStudentById = catchAsync(async (req: Request, res: Response) => {
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
