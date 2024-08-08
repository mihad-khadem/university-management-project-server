import mongoose from "mongoose";
import { TCourse, TCourseFaculty, TPreRequisite } from "./course.interface";
import { Schema } from "mongoose";

const preRequisiteSchema = new mongoose.Schema<TPreRequisite>({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const courseSchema = new mongoose.Schema<TCourse>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    preRequisite: [preRequisiteSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const CourseModel = mongoose.model<TCourse>("Course", courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
    },
  ],
});

export const CourseFaculty = mongoose.model<TCourseFaculty>(
  "CourseFaculty",
  courseFacultySchema
);
