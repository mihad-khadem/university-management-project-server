import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./app/config";
import StudentRoutes from "./app/modules/student/student.route";
import { error } from "console";
import { userRoutes } from "./app/modules/user/user.route";

// Application
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1/students", StudentRoutes);
app.use("./api/v1/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json("University Management System server running");
});

// error middleware

export default app;
