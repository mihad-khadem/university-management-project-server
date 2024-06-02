// src/middleware/validateRequest.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema, AnyZodObject, ZodError } from "zod";
import HttpStatus from "http-status";
import sendResponse from "../utils/sendResponse";

const validateRequest = (schema: AnyZodObject | ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        sendResponse(res, {
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
          message: "Validation Error",
          data: error.errors,
        });
      } else {
        next(error);
      }
    }
  };
};

export default validateRequest;
