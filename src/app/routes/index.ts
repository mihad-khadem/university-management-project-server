// index routes
import express from "express";
import { userRoutes } from "../modules/user/user.route";
import StudentRoutes from "../modules/student/student.route";
import { academicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { academicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { academicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { facultyRoutes } from "../modules/faculty/faculty.route";
import { adminRoutes } from "../modules/admin/admin.route";
import { courseRoutes } from "../modules/course/course.route";
const router = express.Router();

//! main routes
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
    path: "/academic-faculties",
    route: academicFacultyRoutes,
  },
  {
    path: "/academic-departments",
    route: academicDepartmentRoutes,
  },
  {
    path: "/faculty",
    route: facultyRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/courses",
    route: courseRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
