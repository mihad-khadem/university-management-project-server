// controller for auth module

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import config from "../../config";

// login controller

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;
  // Set cookie
  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production" ? true : false,
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: {
      accessToken,
      needsPasswordChange,
    },
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

// refresh token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "access token refreshed successful",
    data: result,
  });
});
// export

export const AuthController = {
  loginUser,
  resetPassword,
  refreshToken,
};
