import { Response } from "express";
import HttpStatus from "http-status";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
};

const sendResponse = <T>(res: Response, data: ApiResponse<T>) => {
  const {
    success,
    message,
    statusCode = HttpStatus.OK,
    data: responseData,
  } = data;

  res.status(statusCode).json({
    statusCode,
    success,
    message,
    data: responseData,
  });
};

export default sendResponse;
