/* eslint-disable @typescript-eslint/no-explicit-any */
class AppError extends Error {
  statusCode: number;
  status: boolean;
  result: any;

  constructor(message: string, statusCode: number = 500, result = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.status = false;
    this.result = result;

    // Untuk stack trace yang benar (khususnya di Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export default AppError;
