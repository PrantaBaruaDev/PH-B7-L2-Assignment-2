import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { config } from "../config";
import { logger } from "../utils/logger";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    // console.error(err.stack);
    const isAppError = err instanceof AppError;

    // better way to handle error
    logger.error(isAppError ? "Operational Error": "System Error", {
      message: err.message,
      path: req.originalUrl,
      method: req.method,
      user: req.user?.id || "guest",
      ...(isAppError ? undefined : {stack: err.stack})
    });

    const statusCode = err instanceof AppError ? err.statusCode : 500;

    res.status(statusCode).json({
      success: false,
      message: err instanceof Error ? err.message : "Internal Server Error",
      error: config.node_env === "development" && err instanceof Error ? err.stack?.split("\n") : undefined,
    });
};

export default globalErrorHandler;
