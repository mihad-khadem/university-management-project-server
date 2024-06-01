// User Services

import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.model";

// create user
const createUserInDB = async (password: string, studentData: TStudent) => {
  const userData: Partial<TUser> = {};
  // if password is not defined by user, use default password
  userData.password = password || (config.defaultPassword as string);
  // set student role
  userData.role = "student";
  // set id manually
  userData.id = "00005";
  // create a user
  const newUser = await UserModel.create(userData);

  if (Object.keys(newUser).length > 0) {
    // set id , _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id; // reference id
    const newStudent = await Student.create(studentData);
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

export const userServices = {
  createUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
};
