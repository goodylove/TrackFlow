import type { NextFunction, Request, Response } from "express";

import { loginUserSchema, registerUserSchema } from "./user.schema.js";
import { loginUser, registerUser } from "./user.service.js";
import { StatusCodes } from "http-status-codes";
import {
  AUTH_COOKIE_NAME,
  authCookieClearOptions,
  getAuthCookieOptions,
} from "../../config/auth-cookie.js";

export const registerUserController = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  const result = registerUserSchema.safeParse({
    body: req.body,
  });

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });

    return;
  }

  const user = await registerUser(result.data.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Account created successfully",
    data: {
      user,
    },
  });
};

export const loginUserController = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  const result = loginUserSchema.safeParse({
    body: req.body,
  });

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });

    return;
  }

  const { token, user } = await loginUser(result.data.body);

  res.set("Cache-Control", "no-store");
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions(result.data.body.remember));

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Login successful",
    data: {
      user,
    },
  });
};

export const logoutUserController = (
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res.set("Cache-Control", "no-store");
  res.clearCookie(AUTH_COOKIE_NAME, authCookieClearOptions);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Logout successful",
  });
};

export const currentUserController = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  res.set("Cache-Control", "no-store");
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Current user retrieved successfully",
    data: {
      user: req.user,
    },
  });
};
