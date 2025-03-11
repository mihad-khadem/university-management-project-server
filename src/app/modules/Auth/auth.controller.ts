// controller for auth module

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";

// login controller

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});
// reset password controller
const resetPassword = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }
  const user = req?.user;
  const { ...passWordData } = req.body;
  const result = await AuthService.changePassword(user, passWordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successful",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  resetPassword,
};
