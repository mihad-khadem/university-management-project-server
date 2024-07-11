import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorSource } from "../interfaces/error";
import config from "../config";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";

// Type for error handler functions
type ErrorHandlerFunction = (err: any) => {
  statusCode: number;
  message: string;
  errorSources: TErrorSource;
};

// Mapping error names to handlers
const errorHandlers: { [key: string]: ErrorHandlerFunction } = {
  ZodError: handleZodError,
  ValidationError: handleValidationError,
  CastError: handleCastError,
  DuplicateError: handleDuplicateError,
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errorSource: TErrorSource = [
    {
      path: "",
      message: "something went wrong",
    },
  ];

  console.error(`Error: ${message}`);

  if (err instanceof ZodError) {
    const simplifiedError = errorHandlers["ZodError"](err);
    status = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  } else if (err?.name === "ValidationError") {
    const simplifiedError = errorHandlers["ValidationError"](err);
    status = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  } else if (err.name === "CastError") {
    const simplifiedError = errorHandlers["CastError"](err);
    status = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  } else if (err.code === 11000) {
    const simplifiedError = errorHandlers["DuplicateError"](err);
    status = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
    errorSource = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSource = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  return res.status(status).json({
    statusCode: status,
    success: false,
    message,
    errorSource,
    stack: config.node_env === "development" ? err?.stack : null,
  });
};

export default errorHandler;
