// User Services

import { TUser } from "./user.interface";
import UserModel from "./user.model";

// create user
const createUserInDB = async (user: TUser) => {
  const result = await UserModel.create(user);
  return result;
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
