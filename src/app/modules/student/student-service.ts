import { Student } from "./student.model";
import { StudentModel, TStudent } from "./student.interface";

const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await StudentModel.create(student); // built in mongoose static method
  const result = await Student.create(studentData);
  if (await Student.isUserExists(studentData.id)) {
    throw new Error("Duplicate key error: ID must be unique");
  }
  return result;
};
const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};
// get student by id
const getStudentById = async (id: string) => {
  const result = await Student.find({ id });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getStudentById,
};
