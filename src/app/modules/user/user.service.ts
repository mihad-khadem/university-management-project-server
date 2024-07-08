import config from "../../config";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import { generateStudentId } from "./user.utils";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import mongoose from "mongoose";
/**
 * Creates a new user and corresponding student record in the database.
 * @param password Password for the user, defaulting to a configured default if not provided.
 * @param payload Student data to be saved, including user details.
 * @returns Newly created student record.
 * @throws {AppError} If any validation or database operation fails.
 */
const createUserInDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.defaultPassword as string);
  userData.role = "student";

  // Start a MongoDB session for transaction handling
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find the academic semester by ID
    const admissionSemester = await AcademicSemesterModel.findById(
      payload.admissionSemester
    );
    if (!admissionSemester) {
      throw new AppError(httpStatus.NOT_FOUND, "Admission semester not found");
    }
    // Generate a new student ID based on the academic semester
    userData.id = await generateStudentId(admissionSemester);
    // Create a new user document (transaction step 1)
    const newUser = await UserModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    // Assign the generated ID and user reference to the payload
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // Create a new student document (transaction step 2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
    }
    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    // Rollback the transaction and close the session on error
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

/**
 * Retrieves all users from the database.
 * @returns List of all user documents.
 */
const getAllUsersFromDB = async () => {
  return await UserModel.find();
};

/**
 * Retrieves a user by their ID from the database.
 * @param id ID of the user to retrieve.
 * @returns User document corresponding to the ID.
 */
const getUserByIdFromDB = async (id: string) => {
  return await UserModel.findById(id);
};

/**
 * Deletes a user by their ID from the database.
 * @param id ID of the user to delete.
 * @returns Deleted user document.
 */
const deleteUserFromDB = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};

// Exported object containing all user-related service functions
export const userServices = {
  createUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  deleteUserFromDB,
};
