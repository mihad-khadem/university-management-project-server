import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
  });
};

export default notFoundHandler;
