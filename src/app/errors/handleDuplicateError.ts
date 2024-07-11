import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error";

const handleDuplicateError = (err: mongoose.Error): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const statusCode = 400;
  const errorSources = [
    {
      path: "",
      message: `${extractedMessage} is already exists`,
    },
  ];
  return {
    statusCode,
    message: "Duplicate Error",
    errorSources,
  };
};

export default handleDuplicateError;
