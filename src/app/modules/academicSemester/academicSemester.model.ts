import { Schema, model } from "mongoose";
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: AcademicSemesterName,
    },
    year: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      enum: AcademicSemesterCode,
    },
    startMonth: {
      type: String,
      required: true,
      enum: Months,
    },
    endMonth: {
      type: String,
      required: true,
      enum: Months,
    },
  },
  {
    timestamps: true,
  }
);

// pre save hook to check if semester is already exists
academicSemesterSchema.pre("save", async function (next) {
  try {
    const isSemesterExists = await AcademicSemesterModel.findOne({
      year: this.year,
      name: this.name,
    });

    if (isSemesterExists) {
      throw new AppError(httpStatus.CONFLICT, "Semester already exists!");
    }

    next();
  } catch (error: any) {
    // send error
    next(error);
  }
});

export const AcademicSemesterModel = model<TAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema
);
