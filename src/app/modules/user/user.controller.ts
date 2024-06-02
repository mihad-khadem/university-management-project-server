import { Request, Response, NextFunction } from "express";
import sendResponse from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { userServices } from "./user.service";
import { TUser } from "./user.interface";
import catchAsync from "../../utils/catchAsync";

// create user
const createUser = catchAsync(async (req: Request, res: Response) => {
  // zod validation
  const { password, student: studentData } = req.body;
  // const validationResult = zodUserValidation.safeParse(studentData);en
  // const validatedUser = validationResult.data as TUser;
  const result = await userServices.createUserInDB(password, studentData);
  sendResponse(res, {
    success: true,
    message: "User created successfully",
    data: result,
    statusCode: HttpStatus.CREATED,
  });
});
// get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAllUsersFromDB();
  sendResponse<TUser[]>(res, {
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});
// get user by id
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await userServices.getUserByIdFromDB(id);
  sendResponse(res, {
    success: true,
    message: "User fetched by id",
    data: result,
  });
});
// delete user by id
const deleteUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await userServices.deleteUserFromDB(id);
  sendResponse(res, {
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
};
