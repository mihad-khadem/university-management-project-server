import express, { Application, Request, Response } from "express";
import cors from "cors";
import errorHandler from "./app/middleware/errorHandler";
import notFoundHandler from "./app/middleware/notFoundHandler";
import routes from "./app/routes";
import cookieParser from "cookie-parser";

// Application
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(cookieParser());

// application routes
app.use("/api/v1", routes);

// default route
app.get("/test", (req: Request, res: Response) => {
  res.json("University Management System server running");
});

// global error handler middleware
app.use(errorHandler);
// 404 not found handler middleware
app.use(notFoundHandler);
export default app;
