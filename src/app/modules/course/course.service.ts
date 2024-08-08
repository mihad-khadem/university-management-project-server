//  Course services

import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCourseFaculty } from "./course.interface";
import { CourseModel, CourseFaculty } from "./course.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

// create result
const createCourseIntoDB = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

// get all courses
const getAllCoursesFromDB = async (payload: Record<string, unknown>) => {
  const query = new QueryBuilder(
    CourseModel.find().populate("preRequisite.course"),
    payload
  )
    .filter()
    .search(CourseSearchableFields)
    .fields()
    .paginate()
    .sort();
  const result = await query.modelQuery;
  return result;
};

// get single course
const getSingleCourseFromDB = async (id: string) => {
  const result = await CourseModel.findById(id).populate("preRequisite.course");
  return result;
};

// update course
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisite, ...remainingCourseData } = payload;

  // starting session
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // update basic course info
    const updatedBasicCourseInfo = await CourseModel.findOneAndUpdate(
      { _id: id }, // <-- Fix here: passing an object with _id as the filter query
      {
        ...remainingCourseData,
      },
      { new: true, runValidators: true, session }
    );

    if (preRequisite && preRequisite.length > 0) {
      const deletedPreRequisite = preRequisite?.filter(
        (el) => el.course && el.isDeleted === true
      );

      // remove preRequisite
      const deletedPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: { preRequisite: { course: { $in: deletedPreRequisite } } },
        },
        { new: true, runValidators: true, session }
      );
    }
    // Commit the transaction
    await session.commitTransaction();

    return updatedBasicCourseInfo;
  } catch (error) {
    // Rollback transaction if there's an error
    await session.abortTransaction();
    throw error; // It's important to rethrow the error so it can be handled upstream
  } finally {
    // End the session
    session.endSession();
  }
};

// delete course
const deleteCourseFromDB = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true }
  );
  return result;
};
const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    }
  );
  return result;
};

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    }
  );
  return result;
};

const CourseServices = {
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  createCourseIntoDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB,
};
export default CourseServices;
