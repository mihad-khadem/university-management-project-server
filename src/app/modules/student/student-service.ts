import { Student } from "./student.model";
import { StudentModel, TStudent } from "./student.interface";

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};
// get student by id
const getStudentById = async (id: string) => {
  const result = await Student.find({ id })
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};
// delete student by id
const deleteStudentFromDB = async (id: string) => {
  const result = await Student.deleteOne({ id });
  return result;
};
export const StudentServices = {
  getAllStudentsFromDB,
  getStudentById,
  deleteStudentFromDB,
};
