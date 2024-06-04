// academic department model
import mongoose, { Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";

const academicDepartmentSchema = new Schema<TAcademicDepartment>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: "AcademicFaculty",
    required: true,
  },
});

export const academicDepartmentModel = mongoose.model<TAcademicDepartment>(
  "AcademicDepartment",
  academicDepartmentSchema
);
