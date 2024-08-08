import mongoose, { Types } from "mongoose";

export type TCourse = {
  name: string;
  code: number;
  description: string;
  credits: number;
  department: string;
  prefix: string;
  preRequisite: [TPreRequisite];
  isDeleted: boolean;
};

export type TPreRequisite = {
  course: Types.ObjectId;
  isDeleted: boolean;
};
export type TCourseFaculty = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
