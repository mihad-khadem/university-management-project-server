// user controller

import { Request, Response } from "express";
import zodUserValidation from "./user.validation";
import { userServices } from "./user.service";
import { TUser } from "./user.interface";
import { TStudent } from "../student/student.interface";

const createUser = async (req: Request, res: Response) => {
  try {
    // zod validation
    const { password, student: studentData } = req.body;
    // const validationResult = zodUserValidation.safeParse(studentData);en
    // const validatedUser = validationResult.data as TUser;
    const result = await userServices.createUserInDB(password, studentData);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      return res.status(409).json({
        success: false,
        message: "Duplicate key error: ID must be unique",
      });
    }
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: error.message || "An unexpected error occurred",
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await userServices.getUserByIdFromDB(id);
    res.status(200).json({
      success: true,
      message: "Student fetched by id",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
};
