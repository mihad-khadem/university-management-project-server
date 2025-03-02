// controller for auth module

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

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

export const AuthController = {
  loginUser,
};
