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
      { _id: id },
      {
        ...remainingCourseData,
      },
      { new: true, runValidators: true, session }
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.NOT_FOUND, "Failed to update course");
    }

    // Handle preRequisite update if provided
    if (preRequisite && preRequisite.length > 0) {
      // Filter out preRequisite where isDeleted is true and extract the course ObjectId
      const deletedPreRequisite = preRequisite
        .filter((el) => el.isDeleted === true)
        .map((el) => el.course); // Extract only the course ObjectId

      // Remove preRequisite courses based on the course ObjectId
      if (deletedPreRequisite.length > 0) {
        await CourseModel.findByIdAndUpdate(
          id,
          {
            $pull: { preRequisite: { course: { $in: deletedPreRequisite } } },
          },
          { new: true, runValidators: true, session }
        );
      }

      // Update or add new preRequisite entries that are not marked as deleted
      const newPreRequisites = preRequisite.filter(
        (el) => el.isDeleted === false
      );
      // console.log(newPreRequisites);

      if (newPreRequisites.length > 0) {
        await CourseModel.findByIdAndUpdate(
          id,
          {
            $addToSet: { preRequisite: { $each: newPreRequisites } },
          },
          { new: true, runValidators: true, session }
        );
      }
      if (!newPreRequisites) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Failed to update preRequisite"
        );
      }
    }

    // Commit the transaction
    await session.commitTransaction();
    const result = await CourseModel.findById(id).populate(
      "preRequisite.course"
    );
    return result;
  } catch (error) {
    // Rollback transaction if there's an error
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course"); // Rethrow the error to be handled upstream
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

// assign faculties
const assignFacultiesToCourseDB = async (
  courseId: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findOneAndUpdate(
    { course: courseId },
    {
      course: courseId,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    }
  );
  return result;
};
// remove faculties
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
  ).populate("course");
  return result;
};

const CourseServices = {
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  createCourseIntoDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  removeFacultiesFromCourseFromDB,
  assignFacultiesToCourseDB,
};
export default CourseServices;
