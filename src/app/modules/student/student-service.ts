import mongoose from "mongoose";
import httpStatus from "http-status";
import { Student } from "./student.model";
import { TStudent } from "./student.interface";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.model";

// Fetch all students from the database
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // searching format : {email: {$regex : query.searchTerm , $options: "i"}},

  let searchTerm = "";
  if (query && query.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const result = await Student.find({
    $or: [
      "fullName",
      "firstName",
      "lastName",
      "email",
      "contactNumber",
      "id",
      "presentAddress",
      "permanentAddress",
    ].map((key) => ({
      [key]: { $regex: searchTerm, $options: "i" },
    })),
  })
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};

// Fetch a student by ID from the database
const getStudentById = async (id: string) => {
  console.log("from service : ", id);

  const result = await Student.findOne({ id })
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  console.log(result);

  return result;
};

// Soft delete a student by ID (makes isDeleted = true)
const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Update the student document to mark it as deleted
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { $set: { isDeleted: true } },
      { new: true, session }
    );

    // If student not found, throw an error
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
    }

    // Update the user document to mark it as deleted
    const deletedUser = await UserModel.findOneAndUpdate(
      { id },
      { $set: { isDeleted: true } },
      { new: true, session }
    );

    // If user not found, throw an error
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to delete student");
  }
};

// Exporting the student services
export const StudentServices = {
  getAllStudentsFromDB,
  getStudentById,
  deleteStudentFromDB,
};
