import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    // console.error(err.stack);
    const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default globalErrorHandler;
