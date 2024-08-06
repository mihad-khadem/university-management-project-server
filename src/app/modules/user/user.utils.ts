import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import UserModel from "./user.model";
// student id generator
const findLastStudentId = async () => {
  const lastStudent = await UserModel.findOne(
    { role: "student" },
    { id: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastStudent?.id || undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  let incrementId = "0001"; // Default starting ID

  // Fetch the last used student ID
  const lastStudentId = await findLastStudentId();

  // Check if the last student ID matches the current semester
  if (lastStudentId) {
    const lastSemesterYear = lastStudentId.substring(0, 4);
    const lastSemesterCode = lastStudentId.substring(4, 6);

    if (
      lastSemesterYear === payload.year &&
      lastSemesterCode === payload.code
    ) {
      const lastIncrement = parseInt(lastStudentId.substring(6), 10);
      incrementId = (lastIncrement + 1).toString().padStart(4, "0");
    }
  }

  const newId = `${payload.year}${payload.code}${incrementId}`;

  // Ensure the generated ID is unique
  const existingStudent = await UserModel.findOne({ id: newId });
  if (existingStudent) {
    throw new AppError(httpStatus.CONFLICT, "Duplicate student ID generated");
    // Handle this case accordingly in your application
  }

  return newId;
};

// faculty id generator
const findLastFacultyId = async () => {
  const lastFaculty = await UserModel.findOne(
    { role: "faculty" },
    { id: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();
  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `F-${incrementId}`;
  return incrementId;
};
// admin id
export const findLastAdminId = async () => {
  const lastAdmin = await UserModel.findOne(
    {
      role: "admin",
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `A-${incrementId}`;
  return incrementId;
};
