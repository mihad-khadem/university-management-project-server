import { Request, Response, NextFunction } from "express";
import sendResponse from "../../utils/sendResponse";
import HttpStatus from "http-status";
import { userServices } from "./user.service";
import { TUser } from "./user.interface";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      sendResponse(res, {
        success: false,
        message: "Duplicate key error: ID must be unique",
        statusCode: HttpStatus.CONFLICT,
      });
    } else {
      next(error);
    }
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.getAllUsersFromDB();
    sendResponse<TUser[]>(res, {
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await userServices.getUserByIdFromDB(id);
    sendResponse(res, {
      success: true,
      message: "User fetched by id",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
};
