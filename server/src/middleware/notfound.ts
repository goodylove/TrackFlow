import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function NotFound(req: Request, res: Response) {
  res.status(StatusCodes.NOT_FOUND).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    status: "error",
    success: false,
  });
}
