import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { config } from "../config";

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
      message: err instanceof Error ? err.message : "Internal Server Error",
      error: config.node_env === "development" && err instanceof Error ? err.stack?.split("\n") : undefined,
    });
};

export default globalErrorHandler;
