// academic semester services

import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemesterModel } from "./academicSemester.model";

// creating academic semester in to DB
const createAcademicSemesterInDB = async (semesterData: TAcademicSemester) => {
  const result = await AcademicSemesterModel.create(semesterData);
  return result;
};

// exports
export const academicSemesterServices = {
  createAcademicSemesterInDB,
};
