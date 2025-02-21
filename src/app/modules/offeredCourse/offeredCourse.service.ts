import { academicDepartmentModel } from "../academicDepartment/academicDepartment.model"; // ✅ Fixed import
import { OfferedCourseModel } from "./offeredCourse.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { SemesterRegistrationModel } from "../semesterRegistration/semesterRegistration.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import { CourseModel } from "../course/course.model";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import mongoose from "mongoose";
import { FacultyModel } from "../faculty/faculty.model";
import { isScheduleConflict } from "./offeredCourse.utils";

// Utility to check schedule conflicts
// Create OfferedCourse
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      semesterRegistration,
      academicFaculty,
      academicDepartment,
      course,
      academicSemester,
      section,
      faculty,
      days,
      startTime,
      endTime,
    } = payload;

    // Validate semester registration
    const semesterExists = await SemesterRegistrationModel.findById(
      semesterRegistration
    ).session(session);
    if (!semesterExists) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Registered Semester not found"
      );
    }

    // Validate academic faculty
    const facultyExists = await AcademicFacultyModel.findById(
      academicFaculty
    ).session(session);
    if (!facultyExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Academic Faculty not found");
    }

    // Validate academic department
    const departmentExists = await academicDepartmentModel // ✅ Fixed variable name
      .findById(academicDepartment)
      .session(session);
    if (!departmentExists) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Academic Department not found"
      );
    }

    // Validate course
    const courseExists = await CourseModel.findById(course).session(session);
    if (!courseExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Course not found");
    }

    // Validate academic semester
    const semesterValid = await AcademicSemesterModel.findById(
      academicSemester
    ).session(session);
    if (!semesterValid) {
      throw new AppError(httpStatus.BAD_REQUEST, "Academic Semester not found");
    }

    // Validate faculty
    const facultyValid = await FacultyModel.findById(faculty).session(session);
    if (!facultyValid) {
      throw new AppError(httpStatus.BAD_REQUEST, "Faculty not found");
    }

    // Validate department-faculty relationship
    const isDepartmentBelongsToFaculty = await academicDepartmentModel
      .findOne({
        _id: academicDepartment,
        academicFaculty,
      })
      .session(session);

    if (!isDepartmentBelongsToFaculty) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Department ${departmentExists?.name} does not belong to Faculty ${facultyExists?.name}`
      );
    }

    // Validate faculty-department relationship
    const isFacultyBelongsToDepartment = await FacultyModel.findOne({
      _id: faculty,
      academicDepartment,
    }).session(session);

    if (!isFacultyBelongsToDepartment) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Faculty ${facultyValid?.name} does not belong to Department ${departmentExists?.name}`
      );
    }

    // Check if the same course is already offered in the same semester & section
    const isOfferedCourseExists = await OfferedCourseModel.findOne({
      semesterRegistration,
      section,
      course,
    }).session(session);

    if (isOfferedCourseExists) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `This course is already offered in this semester for section ${section}`
      );
    }

    // Check for faculty schedule conflicts
    const assignedSchedule = await OfferedCourseModel.find({
      semesterRegistration,
      faculty,
      days: { $in: days },
    })
      .select("days startTime endTime")
      .lean()
      .session(session);

    const formattedSchedule = assignedSchedule.map((schedule) => ({
      days: schedule.days,
      startTime: schedule.startTime.toString(), // ✅ Convert to string
      endTime: schedule.endTime.toString(), // ✅ Convert to string
    }));

    const newSchedule = {
      days,
      startTime: startTime.toString(),
      endTime: endTime.toString(),
    };

    if (isScheduleConflict(formattedSchedule, newSchedule)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Schedule conflict detected for faculty ${facultyValid?.name}`
      );
    }

    // Create new offered course
    const result = await OfferedCourseModel.create([{ ...payload }], {
      session,
    });

    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Export Service
export const OfferedCourseService = {
  createOfferedCourseIntoDB,
};
