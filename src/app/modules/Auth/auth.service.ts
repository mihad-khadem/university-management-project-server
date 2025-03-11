// auth service

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.model";
import { TUserLogin } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
const loginUser = async (payload: TUserLogin) => {
  //  check if user exists
  const user = await UserModel.isUserExistByCustomId(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Does Not Exist");
  }
  // check if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
  }
  // check if the user is blocked
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }
  // check if the users password is correct
  if (!UserModel.validatePassword(payload.password, user.password)) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Enter valid password ");
  }
  // access granted if the user pass all validations, send with access token and refresh token
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const token = jwt.sign(jwtPayload, config.jwtAccessSecret as string, {
    expiresIn: "72h",
  });
  return {
    token,
    needsPasswordChange: user?.needsPasswordChange,
  };
};
// change password service -> reset
const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // change password logic
  const result = await UserModel.findOneAndUpdate({
    id: user.userId,
    role: user.role,
  });
};
export const AuthService = {
  loginUser,
  changePassword,
};
