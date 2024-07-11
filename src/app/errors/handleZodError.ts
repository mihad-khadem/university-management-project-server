import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse } from "../interfaces/error";

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  return {
    statusCode,
    message: "validation error",
    errorSources,
  };
};

export default handleZodError;
