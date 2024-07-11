class AppError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string, stack: string = " ") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;

// pattern
/* 
 success 
 message
 error source : [
 path : "",
 message : "" ]
 stack : ""
 */
