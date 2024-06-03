// academic semester services

import { academicSemesterNameCodeMapper } from "./academicSemester.constant";
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
// get academic semester by id
const getAcademicSemesterByIdFromDB = async (id: string) => {
  const result = await AcademicSemesterModel.findById(id);
  return result;
};
// update academic semester using patch
const updateAcademicSemesterInDB = async (
  id: string,
  payload: Partial<TAcademicSemester>
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error("Invalid semester code");
  }
  const result = await AcademicSemesterModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

// delete academic semester
const deleteAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemesterModel.findByIdAndDelete(id);
  return result;
};
// exports
export const academicSemesterServices = {
  createAcademicSemesterInDB,
  getAllAcademicSemestersFromDB,
  getAcademicSemesterByIdFromDB,
  updateAcademicSemesterInDB,
  deleteAcademicSemesterFromDB,
};
