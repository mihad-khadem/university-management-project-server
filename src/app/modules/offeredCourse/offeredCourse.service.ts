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
      startTime: schedule.startTime.toString(), //  Converted to string
      endTime: schedule.endTime.toString(), //  Converted to string
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
// Get All Offered Courses
const getAllOfferedCoursesFromDB = async () => {
  try {
    const offeredCourses = await OfferedCourseModel.find().populate({
      path: "semesterRegistration",
      populate: {
        path: "academicSemester",
      },
    });
    if (!offeredCourses) {
      throw new AppError(httpStatus.NOT_FOUND, "Offered Courses not found");
    }
    return offeredCourses;
  } catch (error) {
    throw error;
  }
};
// get Offered Course by id
const getOfferedCourseByIdFromDB = async (id: string) => {
  try {
    const offeredCourse = await OfferedCourseModel.findById(id).populate({
      path: "semesterRegistration",
      populate: {
        path: "academicSemester",
      },
    });
    if (!offeredCourse) {
      throw new AppError(httpStatus.NOT_FOUND, "Offered Course not found");
    }
    return offeredCourse;
  } catch (error) {
    throw error;
  }
};
// Update Offered Course

/*
1. only faculty, capacity, days & start time, end time can be updated
2. check if the offered course exists
3. check if the faculty exists
4. check the status of the semester registration
5. handle time conflict
6. finally update the offered course

*/
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<
    TOfferedCourse,
    "faculty" | "maxCapacity" | "days" | "startTime" | "endTime"
  >
) => {
  try {
    const { faculty, maxCapacity, days, startTime, endTime } = payload;
    // check if the offered course exists
    const offeredCourseExist = await OfferedCourseModel.findById(id);
    if (!offeredCourseExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Offered Course not found");
    }
    // check if the faculty exists
    const facultyExist = await FacultyModel.findById(faculty);
    if (!facultyExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Faculty not found");
    }
    // semester registration
    const semesterRegistration = offeredCourseExist.semesterRegistration;
    // check the status of the semester registration
    const semesterRegistrationStatus = await SemesterRegistrationModel.findById(
      semesterRegistration
    );
    if (semesterRegistrationStatus?.status !== "UPCOMING") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot update the course. Semester registration status is ${semesterRegistrationStatus?.status}`
      );
    }
    // handle time conflict
    const assignedSchedule = await OfferedCourseModel.find({
      semesterRegistration,
      faculty,
      days: { $in: days },
    })
      .select("days startTime endTime")
      .lean();
    // format to string
    const formattedSchedule = assignedSchedule.map((schedule) => ({
      days: schedule.days,
      startTime: schedule.startTime.toString(), //  Converted to string
      endTime: schedule.endTime.toString(), //  Converted to string
    }));

    const newSchedule = {
      days: days ?? [],
      startTime: startTime?.toString(),
      endTime: endTime?.toString(),
    };

    if (isScheduleConflict(formattedSchedule, newSchedule)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Schedule conflict detected for faculty`
      );
    }

    // finally update the offered course
    const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return result;
  } catch (error) {
    throw error;
  }
};
// Delete Offered Course
/**
     Step 1: check if the offered course exists
     Step 2: check if the semester registration status is upcoming
     Step 3: delete the offered course
*/
const deleteOfferedCourseFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Step 1: Check if the offered course exists
    const offeredCourse = await OfferedCourseModel.findById(id).session(
      session
    );
    if (!offeredCourse) {
      throw new AppError(httpStatus.NOT_FOUND, "Offered Course not found");
    }

    // Step 2: Check if the semester registration status is upcoming
    const semesterRegistration = await SemesterRegistrationModel.findById(
      offeredCourse.semesterRegistration
    ).session(session);

    if (!semesterRegistration) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Semester Registration not found"
      );
    }

    if (semesterRegistration.status !== "UPCOMING") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot delete the course! Semester status is ${semesterRegistration.status}`
      );
    }

    // Step 3: Delete the offered course
    await OfferedCourseModel.findByIdAndDelete(id).session(session);

    // Step 4: Commit the transaction
    await session.commitTransaction();
    session.endSession();
    return {
      message: "Offered course deleted successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Export Service
export const OfferedCourseService = {
  createOfferedCourseIntoDB,
  getOfferedCourseByIdFromDB,
  getAllOfferedCoursesFromDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
};
