/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Model } from "mongoose";
// interface for user
export interface TUser extends Document {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  status: "in-progress" | "blocked";
  role: "admin" | "student" | "faculty";
  isDeleted: boolean;
}
// statics methods for validation
export interface IUserModel extends Model<TUser> {
  // instance method for checking if user exists
  isUserExistByCustomId: (id: string) => Promise<TUser | null>;
  // instance method for validating password
  validatePassword: (
    passwordFromUser: string,
    hashedPassword: string
  ) => Promise<boolean>;
  // instance method for checking if JWT issued before password change
  isJWTIssuedBeforePasswordChange: (
    passwordChangeTimeStamp: Date,
    jwtIssuedTimeStamp: number
  ) => boolean;
}

export const USER_ROLE = {
  student: "student",
  faculty: "faculty",
  admin: "admin",
} as const;
export type TUserRole = keyof typeof USER_ROLE;
