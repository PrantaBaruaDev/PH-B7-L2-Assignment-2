import type { Response } from "express";
import { logger } from "./logger";

export function sendResponse<T>(
  res: Response,
  { message, data, }: { message?: string; data?: T;  },
  status = 200
) {

  logger.info("Response sent", {
    statusCode: status,
    path: res.req?.originalUrl,
    method: res.req?.method,
    user: res.req?.user?.id || "guest"
  });

  res.status(status).json({
    success: true,
    message,
    data,
  });
}