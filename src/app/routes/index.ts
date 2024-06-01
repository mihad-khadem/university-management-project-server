// routes
import express from "express";
import { userRoutes } from "../modules/user/user.route";
import StudentRoutes from "../modules/student/student.route";
import path from "path";
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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
