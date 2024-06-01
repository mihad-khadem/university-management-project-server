import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

// create user api
router.post("/create-student", userController.createUser);

export const userRoutes = router;
