/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { IUserModel, TUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

// user schema

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
      select: false,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
      required: false,
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
// statics methods

// checking if user is already exist!
userSchema.statics.isUserExistByCustomId = async function (id: string) {
  return await this.findOne({ id }).select("+password");
};
// validating password
userSchema.statics.validatePassword = async function (
  passwordFromUser,
  hashedPassword
) {
  return await bcrypt.compare(passwordFromUser, hashedPassword);
};
// checking if JWT issued before password change
userSchema.statics.isJWTIssuedBeforePasswordChange = async function (
  passwordChangeTimeStamp: Date,
  jwtIssuedTimeStamp: number
) {
  const passwordChangedAt = new Date(passwordChangeTimeStamp).getTime() / 1000;
  return passwordChangedAt > jwtIssuedTimeStamp;
};
const UserModel = mongoose.model<TUser, IUserModel>("User", userSchema);
export default UserModel;
