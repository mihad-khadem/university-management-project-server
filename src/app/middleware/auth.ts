// auth utils / middlewares
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { TUserRoles } from "../modules/Auth/auth.interface";
import UserModel from "../modules/user/user.model";

// validateAuthToken middleware
const validateAuthToken = (...requiredRoles: TUserRoles[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    // check if the authorization header is present
    if (!authHeader) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to access this resource! Token not found"
      );
    }
    // check if the authorization header is valid
    const decoded = jwt.verify(authHeader, config.jwtAccessSecret as string);
    if (!decoded) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to access this resource! Invalid token"
      );
    }
    const { userId, iat, role } = decoded as JwtPayload;
    // check if the user has the required roles
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to access this resource! You don't have the required role"
      );
    }
    // check is user exists
    const user = await UserModel.isUserExistByCustomId(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    // check if the user is deleted
    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
    }
    // check if the user is blocked
    if (user?.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
    }
    // Debugging code
    // const passChangeTime = await UserModel.isJWTIssuedBeforePasswordChange(
    //   user.passwordChangedAt as Date,
    //   iat as number
    // );
    // console.log("User passwordChangedAt:", user.passwordChangedAt);
    // console.log("JWT issued at (iat):", iat);
    // console.log("Password changed after token was issued:" + passChangeTime);

    // check if the user changed password after the token was issued
    if (
      user.passwordChangedAt &&
      (await UserModel.isJWTIssuedBeforePasswordChange(
        user.passwordChangedAt,
        iat as number
      ))
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to access this resource! Password changed after token was issued! Please login again"
      );
    }
    // set the user object in the request
    req.user = decoded as JwtPayload;

    next();
  });
};

export default validateAuthToken;
