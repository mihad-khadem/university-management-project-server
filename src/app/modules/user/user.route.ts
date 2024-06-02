import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

// create user api
router.post("/create-student", userController.createUser);

// get all users
router.get("/get-all-users", userController.getAllUsers);
// get user by id
router.get("/:id", userController.getUserById);
// delete user by id
router.delete("/:id", userController.deleteUserById);

export const userRoutes = router;
