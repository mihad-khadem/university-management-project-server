import mongoose from "mongoose";
import { TUser } from "./user.interface";

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

const UserModel = mongoose.model<TUser>("User", userSchema);
export default UserModel;
