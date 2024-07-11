import { Response } from "express";
import HttpStatus from "http-status";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
};

const sendResponse = <T>(res: Response, data: ApiResponse<T>) => {
  res.status(data?.statusCode ?? HttpStatus.OK).json({
    statusCode: data?.statusCode,
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
