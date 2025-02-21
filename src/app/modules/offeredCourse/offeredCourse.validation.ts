import { z } from "zod";
import { TDays } from "./offeredCourse.interface";

// Create Offered Course Validation Schema
const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicDepartment: z.string(),
      academicSemester: z.string(),
      academicFaculty: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum(Object.values(TDays) as [TDays, ...TDays[]])),
      startTime: z.string().refine(
        (time) => {
          const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        { message: "Invalid start time format. Use HH:MM" }
      ), // HH:MM
      endTime: z.string().refine(
        (time) => {
          const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        { message: "Invalid end time format. Use HH:MM" }
      ), // HH:MM
    })
    .refine(
      ({ startTime, endTime }) => {
        const start = new Date(`2021-01-01T${startTime}`);
        const end = new Date(`2021-01-01T${endTime}`);
        return start < end;
      },
      { message: "Start time must be before end time" }
    ),
});

// Update Offered Course Validation Schema
const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    // semesterRegistration: z.string().optional(),   // Cannot be updated
    // academicDepartment: z.string().optional(),
    // academicSemester: z.string().optional(),
    // academicFaculty: z.string().optional(),
    // course: z.string().optional(),
    faculty: z.string().optional(),
    maxCapacity: z.number().optional(),
    // section: z.number().optional(),
    days: z.enum(Object.values(TDays) as [TDays, ...TDays[]]).optional(),
    startTime: z
      .string()
      .refine(
        (time) => {
          const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        { message: "Invalid start time format. Use HH:MM" }
      )
      .optional(), // HH:MM
    endTime: z
      .string()
      .refine(
        (time) => {
          const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        { message: "Invalid end time format. Use HH:MM" }
      )
      .optional(), // HH:MM
  }),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
