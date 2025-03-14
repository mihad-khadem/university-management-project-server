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
  // check if the password is empty
  if (!payload.password || payload.password.trim() === "") {
    console.log("Error: Password is empty");
    throw new AppError(httpStatus.BAD_REQUEST, "Password cannot be empty!");
  }
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
  const isPasswordValid = await UserModel.validatePassword(
    payload.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid password! Enter valid password"
    );
  }

  // access granted if the user pass all validations, send with access token and refresh token
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwtAccessSecret as string,
    config.jwtAccessExpiration as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwtRefreshSecret as string,
    config.jwtRefreshExpiration as string
  );
  console.log("Received password:", payload.password);
  console.log("Stored password:", user.password);
  console.log("Password validation result:", isPasswordValid);
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
// refresh token
const refreshToken = async (token: string) => {
  // refresh token logic
  //  check if the token is not present
  if (!token) {
    throw new AppError(httpStatus.FORBIDDEN, "Refresh token is required!");
  }
  // check if the token is valid
  const decoded = jwt.verify(token, config.jwtRefreshSecret as string);
  if (!decoded) {
    throw new AppError(httpStatus.FORBIDDEN, "Invalid refresh token!");
  }
  const { userId, role, iat } = decoded as JwtPayload;
  // check if the user exists
  const user = await UserModel.isUserExistByCustomId(userId);
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
  // check if the user has the required roles
  if (user?.role !== "admin") {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
  }
  // check if the token is expired or not
  if (
    user?.passwordChangedAt &&
    (await UserModel.isJWTIssuedBeforePasswordChange(
      user.passwordChangedAt,
      iat as number
    ))
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Password changed, please login again!"
    );
  }
  // payload
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  // create access token
  const accessToken = createToken(
    jwtPayload,
    config.jwtAccessSecret as string,
    config.jwtAccessExpiration as string
  );
  // access granted if the user pass all validations, send with access token and refresh token
  return {
    accessToken,
  };
};

// export
export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
};
