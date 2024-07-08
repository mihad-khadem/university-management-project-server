import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import UserModel from "./user.model";

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
    throw new Error("Duplicate student ID generated");
    // Handle this case accordingly in your application
  }

  return newId;
};
