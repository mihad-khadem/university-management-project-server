import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./app/config";
import StudentRoutes from "./app/modules/student/student.route";
import { error } from "console";
import { userRoutes } from "./app/modules/user/user.route";
import errorHandler from "./app/middleware/errorHandler";
import notFoundHandler from "./app/middleware/notFoundHandler";

// Application
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1/students", StudentRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json("University Management System server running");
});

// global error handler middleware
app.use(errorHandler);
// 404 not found handler middleware
app.use(notFoundHandler);
export default app;
