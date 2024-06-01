import mongoose from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

export const userSchema = new mongoose.Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
    },
    role: {
      type: String,
      enum: ["admin", "student", "faculty"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// pre-save hook
userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, 10);
  next();
});
// post save hook
userSchema.post("save", function (doc, next) {
  doc.password = " ";
  next();
});

const UserModel = mongoose.model<TUser>("User", userSchema);
export default UserModel;
