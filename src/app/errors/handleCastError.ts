import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interfaces/error";

const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const errorSources: TErrorSource = [
    {
      path: err.path,
      message: err.message,
      value: err.value,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: "Cast Error",
    errorSources,
  };
};

export default handleCastError;
