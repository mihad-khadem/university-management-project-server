import config from "../../config";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import { generateStudentId } from "./user.utils";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.model";

// create user
const createUserInDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};
  // if password is not defined by user, use default password
  userData.password = password || (config.defaultPassword as string);
  // set student role
  userData.role = "student";
  // find academic semester
  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester
  );
  // if admission semester not found, throw error
  if (!admissionSemester) {
    throw new Error("Admission semester not found");
  }
  // generate id
  userData.id = await generateStudentId(admissionSemester);
  // create a user
  const newUser = await UserModel.create(userData);
  if (newUser) {
    // set id, _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; // reference id
    const newStudent = await Student.create(payload);
    return newStudent;
  }
  return newUser;
};

// get all users
const getAllUsersFromDB = async () => {
  const result = await UserModel.find();
  return result;
};

// get user by id
const getUserByIdFromDB = async (id: string) => {
  const result = await UserModel.findById(id);
  return result;
};

// delete user by id
const deleteUserFromDB = async (id: string) => {
  const result = await UserModel.findByIdAndDelete(id);
  return result;
};

export const userServices = {
  createUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  deleteUserFromDB,
};
