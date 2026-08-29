import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  ExistingMemberError,
  WorkspaceAlreadyExistsError,
} from "../errors/workspace.error.js";
import {
  AuthenticationError,
  InvalidCredentialsError,
  UserNotFoundError,
} from "../errors/authentication.error.js";
import { EmailAlreadyExistsError } from "../modules/user/user.service.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AuthenticationError) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      status: "error",
      message: err.message,
    });

    return;
  }

  if (err instanceof InvalidCredentialsError) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      status: "error",
      message: err.message,
    });

    return;
  }

  if (err instanceof EmailAlreadyExistsError) {
    res.status(StatusCodes.CONFLICT).json({
      success: false,
      status: "error",
      message: err.message,
    });

    return;
  }

  if (err instanceof UserNotFoundError) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      status: "error",
      message: err.message,
    });

    return;
  }

  if (err instanceof ExistingMemberError) {
    res.status(StatusCodes.CONFLICT).json({
      success: false,
      status: "error",
      message: err.message,
    });

    return;
  }

  if (err instanceof WorkspaceAlreadyExistsError) {
    res.status(StatusCodes.CONFLICT).json({
      success: false,
      status: "error",
      message: err.message,
    });

    return;
  }
  console.log(err);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal server error", status: "error", success: false });
};
