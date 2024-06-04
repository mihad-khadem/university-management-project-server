// validation with zod

import { z } from "zod";

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "Academic department must be string",
    }),
    academicFaculty: z.string({
      invalid_type_error: "Academic department must be string",
    }),
  }),
});
// update validation
const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "Academic department must be string",
    }),
    academicFaculty: z.string({
      invalid_type_error: "Academic department must be string",
    }),
  }),
});
export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
