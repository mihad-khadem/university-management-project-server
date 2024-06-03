import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import UserModel from "./user.model";

// find last admitted student id
const findLastStudentId = async () => {
  const lastStudent = await UserModel.findOne(
    {
      role: "student",
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
  //203001   0001
  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};
export const generateStudentId = async (payload: TAcademicSemester) => {
  // first time 0000
  //0001  => 1
  let currentId = (0).toString(); // 0000 by default
  const lastStudentId = await findLastStudentId();
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6); // 01
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4); // 2023
  const currentSemesterCode = payload?.code;
  const currentSemesterYear = payload?.year;
  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentSemesterYear === currentSemesterYear
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};
