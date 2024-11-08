import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: "API Not Found",
    statusCode: HttpStatus.NOT_FOUND,
  });
};

export default notFoundHandler;
