// index routes
import express from "express";
import { userRoutes } from "../modules/user/user.route";
import StudentRoutes from "../modules/student/student.route";
import { academicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { academicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
const router = express.Router();

// routes
const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/academic-semesters",
    route: academicSemesterRoutes,
  },
  {
    path: "/academic-facultys",
    route: academicFacultyRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
