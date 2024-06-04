// academic faculty service

import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFacultyModel } from "./academicFaculty.model";

// create new academic faculty
const createAcademicFaculty = async (payload: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(payload);
  return result;
};

// get all academic faculty
const getAllAcademicFaculties = async () => {
  const result = await AcademicFacultyModel.find();
  return result;
};
// get one academic faculty by id
const getSingleAcademicFaculty = async (id: string) => {
  const result = await AcademicFacultyModel.findById(id);
  return result;
};
// update one academic faculty by id
const updateAcademicFaculty = async (
  id: string,
  payload: Partial<TAcademicFaculty>
) => {
  const result = await AcademicFacultyModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
// delete one academic faculty by id
const deleteAcademicFaculty = async (id: string) => {
  const result = await AcademicFacultyModel.findByIdAndDelete(id);
  return result;
};
// exports

export const academicFacultyServices = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty,
};
