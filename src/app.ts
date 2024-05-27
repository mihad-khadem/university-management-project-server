import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./app/config";
import StudentRoutes from "./app/modules/student/student.route";

// Application
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1/students", StudentRoutes);

app.get("/", (req: Request, res: Response) => {
  var a = 10;
  // Send a JSON response with a property named "data" containing the value of 'a'
  res.json("Hello World");
});

export default app;
