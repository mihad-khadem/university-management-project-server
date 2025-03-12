// auth service

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.model";
import { TUserLogin } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from "bcrypt";
import createToken from "./auth.utils";

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
  const accessToken = createToken(
    jwtPayload,
    config.jwtAccessSecret as string,
    "36h"
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwtRefreshSecret as string,
    "14d"
  );
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};
// change password service -> reset
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // change password logic
  const user = await UserModel.isUserExistByCustomId(userData.userId);
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
  if (!UserModel.validatePassword(payload?.oldPassword, user.password)) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Enter valid password ");
  }
  // Hash the new password and update the user
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcryptSaltRounds)
  );
  // change password is changed once
  if (!user?.needsPasswordChange) {
    throw new AppError(httpStatus.FORBIDDEN, "Password already changed once!");
  }
  const result = await UserModel.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  return null;
};
export const AuthService = {
  loginUser,
  changePassword,
};
