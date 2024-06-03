// academic semester services

import {
  TAcademicSemester,
  TAcademicSemesterNameCodeMapper,
} from "./academicSemester.interface";
import { AcademicSemesterModel } from "./academicSemester.model";

// creating academic semester in to DB
const createAcademicSemesterInDB = async (payload: TAcademicSemester) => {
  // semester code mapper for validate the code of semester
  const academicSemesterCodeMapper: TAcademicSemesterNameCodeMapper = {
    Autumn: "01",
    Summer: "02",
    Fall: "03",
  };
  if (academicSemesterCodeMapper[payload.name] !== payload.code) {
    throw new Error("Invalid semester code");
  }
  const result = await AcademicSemesterModel.create(payload);
  return result;
};

// get all academic semesters
const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemesterModel.find();
  return result;
};

// exports
export const academicSemesterServices = {
  createAcademicSemesterInDB,
  getAllAcademicSemestersFromDB,
};
