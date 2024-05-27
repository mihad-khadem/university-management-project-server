import { Request, Response } from "express";
import { StudentServices } from "./student-service";
import { TStudent } from "./student.interface";
import { zodStudentSchema } from "./zod.validation";

const createStudent = async (req: Request, res: Response) => {
  try {
    // zod validation
    const studentData = req.body.student;
    const validationResult = zodStudentSchema.safeParse(studentData);
    const validatedStudent = validationResult.data as TStudent;
    const result = await StudentServices.createStudentIntoDB(validatedStudent);
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      return res.status(409).json({
        success: false,
        message: "Duplicate key error: ID must be unique",
      });
    }
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: error.message || "An unexpected error occurred",
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
};

const getStudentById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await StudentServices.getStudentById(id);
    res.status(200).json({
      success: true,
      message: "Student fetched by id",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
};

export const StudentController = {
  createStudent,
  getAllStudents,
  getStudentById,
};
