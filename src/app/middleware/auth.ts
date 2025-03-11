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
        "You are not authorized to access this resource"
      );
    }
    // check if the authorization header is valid
    const decoded = jwt.verify(authHeader, config.jwtAccessSecret as string);
    if (!decoded) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to access this resource"
      );
    }
    const { userId, iat, role } = decoded as JwtPayload;
    // check if the user has the required roles
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to access this resource"
      );
    }
    // check is user exists
    const user = await UserModel.isUserExistByCustomId(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // set the user object in the request
    req.user = decoded as JwtPayload;

    next();
  });
};

export default validateAuthToken;
