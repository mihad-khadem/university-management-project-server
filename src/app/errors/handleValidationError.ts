import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interfaces/error";

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources: TErrorSource = Object.values(err.errors).map(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: value?.path,
        message: value?.message,
        value: value.value,
      };
    }
  );

  const status = 400;
  return {
    statusCode: status,
    message: "Validation Error",
    errorSources,
  };
};

export default handleValidationError;
