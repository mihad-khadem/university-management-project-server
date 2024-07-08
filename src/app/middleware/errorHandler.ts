import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  details?: string;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`Error: ${message}`);

  res.status(status).json({
    success: false,
    message,
    ...(err.details && { details: err.details }),
  });
};

export default errorHandler;
