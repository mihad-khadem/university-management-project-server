import mongoose from "mongoose";
import { TOfferedCourse } from "./offeredCourse.interface";
import { Days } from "./offeredCourse.constants";

const offeredCourseSchema = new mongoose.Schema<TOfferedCourse>({
  semesterRegistration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SemesterRegistration",
    required: true,
  },
  academicDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicDepartment",
    required: true,
  },
  academicFaculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicFaculty",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  maxCapacity: {
    type: Number,
    required: true,
  },
  section: {
    type: Number,
    required: true,
  },
  days: [
    {
      type: String,
      enum: Days,
    },
  ],
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

export const OfferedCourseModel = mongoose.model<TOfferedCourse>(
  "OfferedCourse",
  offeredCourseSchema
);
