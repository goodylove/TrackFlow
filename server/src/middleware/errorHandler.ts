import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { Error } from "mongoose";

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", status: "error", success: false });
}