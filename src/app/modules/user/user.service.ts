import config from "../../config";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from "./user.utils";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { TFaculty } from "../faculty/faculty.interface";
import { academicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { FacultyModel } from "../faculty/faculty.model";
import { TAdmin } from "../admin/admin.interface";
import { AdminModel } from "../admin/admin.model";

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
    payload.user = newUser[0]._id as mongoose.Types.ObjectId;

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

/**
 * Creates a new faculty and corresponding user record in the database.
 * @param password Password for the user, defaulting to a configured default if not provided.
 * @param payload Faculty data to be saved, including user details.
 * @returns Newly created faculty record.
 * @throws {AppError} If any validation or database operation fails.
 */
const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.defaultPassword as string);
  userData.role = "faculty";

  // Find the academic department by ID
  const academicDepartment = await academicDepartmentModel.findById(
    payload.academicDepartment
  );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic department not found");
  }

  // Start a MongoDB session for transaction handling
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Generate a new faculty ID
    userData.id = await generateFacultyId();

    // Create a new user document (transaction step 1)
    const newUser = await UserModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    // Assign the generated ID and user reference to the payload
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id as mongoose.Types.ObjectId;

    // Create a new faculty document (transaction step 2)
    const newFaculty = await FacultyModel.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create faculty");
    }

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (error) {
    // Rollback the transaction and close the session on error
    await session.abortTransaction();
    await session.endSession();
    throw error;
  } finally {
    await session.endSession();
    console.log("session ended");
  }
};

/**
 * Creates a new admin and corresponding user record in the database.
 * @param password Password for the user, defaulting to a configured default if not provided.
 * @param payload Admin data to be saved, including user details.
 * @returns Newly created admin record.
 * @throws {AppError} If any validation or database operation fails.
 */
const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.defaultPassword as string);
  userData.role = "admin";

  // Start a MongoDB session for transaction handling
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Generate a new admin ID
    userData.id = await generateAdminId();

    // Create a new user document (transaction step 1)
    const newUser = await UserModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }
    // console.log(newUser);

    // Assign the generated ID and user reference to the payload
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id as mongoose.Types.ObjectId;

    // Create a new admin document (transaction step 2)
    const newAdmin = await AdminModel.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error) {
    // Rollback the transaction and close the session on error
    await session.abortTransaction();
    await session.endSession();
    throw error;
  } finally {
    await session.endSession();
  }
};

// Exported object containing all user-related service functions
export const userServices = {
  createUserInDB,
  createFacultyIntoDB,
  createAdminIntoDB, // Fixed function name
  getAllUsersFromDB,
  getUserByIdFromDB,
  deleteUserFromDB,
};
