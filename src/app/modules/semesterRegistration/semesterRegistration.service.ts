// Semester Registration Service

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistrationModel } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import mongoose from "mongoose";

// Create semester registration in the database
const createSemesterRegistrationInDB = async (
  payload: TSemesterRegistration
) => {
  const academicSemester = payload.academicSemester;

  // Check if there is an already registered semester with status UPCOMING or ONGOING
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistrationModel.findOne({
      $or: [{ status: "UPCOMING" }, { status: "ONGOING" }],
    });
  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester.`
    );
  }

  // Check if semester registration already exists
  const isAlreadyRegistered = await SemesterRegistrationModel.findOne({
    academicSemester,
  });
  if (isAlreadyRegistered) {
    throw new AppError(httpStatus.CONFLICT, "Semester already registered");
  }

  // Check if the academic semester exists
  const isAcademicSemesterExists = await AcademicSemesterModel.findById(
    academicSemester
  );
  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester not found");
  }

  const result = await SemesterRegistrationModel.create(payload);
  return result;
};

// Get all semester registrations
const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistrationModel.find().populate("academicSemester"),
    query
  )
    .filter()
    .sort()
    .fields()
    .paginate();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

// Get a single semester registration by ID
const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistrationModel.findById(id).populate(
    "academicSemester"
  );
  return result;
};

// Update semester registration
const updateSemesterRegistrationInDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>
) => {
  // Check if requested semester registration exists
  const existingRegistration = await SemesterRegistrationModel.findById(id);
  if (!existingRegistration) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Semester registration not found"
    );
  }

  // Prevent updates to a semester registration that has already ended
  if (existingRegistration.status === "ENDED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Semester registration already ended"
    );
  }

  // Check and enforce the one-way progression of statuses
  const requestedStatus = payload.status;
  if (
    (existingRegistration.status === "UPCOMING" &&
      requestedStatus === "ENDED") ||
    (existingRegistration.status === "ONGOING" &&
      requestedStatus === "UPCOMING")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition from ${existingRegistration.status} to ${requestedStatus}.`
    );
  }

  // Proceed with update if status progression is valid
  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};
// delete semester registration with session
const deleteSemesterRegistrationFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedSemesterRegistration =
      await SemesterRegistrationModel.findOneAndUpdate(
        { id },
        { isDeleted: true },
        { new: true, session }
      );
    if (!deletedSemesterRegistration) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to delete semester registration"
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedSemesterRegistration;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};
export const semesterRegistrationService = {
  createSemesterRegistrationInDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationInDB,
  deleteSemesterRegistrationFromDB,
};
