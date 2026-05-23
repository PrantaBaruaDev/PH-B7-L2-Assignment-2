// src/middleware/requestLogger.ts

import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl,
    user: res.req?.user || "guest"
  });

  next();
};