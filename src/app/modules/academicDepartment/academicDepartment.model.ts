// academic department model
import mongoose, { Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
    },
  },
  {
    timestamps: true,
  }
);
// check department already exists
academicDepartmentSchema.pre("save", async function (next) {
  const isDepartmentExists = await academicDepartmentModel.findOne({
    name: this.name,
  });
  if (isDepartmentExists) {
    throw new Error("This department is already exists !!");
  }
  next();
});
// query middleware to check is department exists
academicDepartmentSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();
  console.log(query);
  const isDepartmentExists = await academicDepartmentModel.findOne(query);
  if (!isDepartmentExists) {
    throw new Error("This department does not exist");
  }
  next();
});

export const academicDepartmentModel = mongoose.model<TAcademicDepartment>(
  "AcademicDepartment",
  academicDepartmentSchema
);
