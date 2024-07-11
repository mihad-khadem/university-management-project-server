// academic department service

import { TAcademicDepartment } from "./academicDepartment.interface";
import { academicDepartmentModel } from "./academicDepartment.model";

// create new academic department
const createAcademicDepartmentInDB = async (payload: TAcademicDepartment) => {
  const result = await academicDepartmentModel.create(payload);
  return result;
};
// get all academic departments
const getAllAcademicDepartmentsFromDB = async () => {
  const result = await academicDepartmentModel
    .find()
    .populate("academicFaculty");
  return result;
};
// get single academic department
const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result = await academicDepartmentModel
    .findById(id)
    .populate("academicFaculty");
  console.log(id);

  return result;
};
// update single academic department
const updateAcademicDepartmentInDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>
) => {
  const result = await academicDepartmentModel.findByIdAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    }
  );
  return result;
};
// delete single academic department
const deleteAcademicDepartmentInDB = async (id: string) => {
  const result = await academicDepartmentModel.findByIdAndDelete(id);
  return result;
};
export const academicDepartmentServices = {
  createAcademicDepartmentInDB,
  getAllAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentInDB,
  deleteAcademicDepartmentInDB,
};
