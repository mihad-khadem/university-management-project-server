import { Request, Response } from "express";
import { StudentServices } from "./student-service";
import { TStudent } from "./student.interface";
import { zodStudentSchema } from "./zod.validation";

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
// Delete student by id
const deleteStudentById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await StudentServices.deleteStudentFromDB(id);
    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: result,
    });
  } catch (error) {}
};
export const StudentController = {
  getAllStudents,
  getStudentById,
};
