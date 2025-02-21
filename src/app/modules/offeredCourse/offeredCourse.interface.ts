import { Types } from "mongoose";
// types
export enum TDays {
  Monday = "Monday",

  Tuesday = "Tuesday",

  Wednesday = "Wednesday",

  Thursday = "Thursday",

  Friday = "Friday",

  Saturday = "Saturday",

  Sunday = "Sunday",
}

export type TOfferedCourse = {
  semesterRegistration: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  maxCapacity: Number;
  section: Number;
  days: TDays[];
  startTime: String;
  endTime: String;
};
export type TSchedule = {
  days: TDays[];
  startTime: string;
  endTime: string;
};
