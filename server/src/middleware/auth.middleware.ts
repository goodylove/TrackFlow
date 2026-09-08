import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { env } from "../config/env.js";
import { AUTH_COOKIE_NAME } from "../config/auth-cookie.js";
import { User } from "../modules/user/user.model.js";
import { StatusCodes } from "http-status-codes";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Browsers send this cookie automatically, while httpOnly prevents
  // application JavaScript from reading the JWT.
  const token = req.cookies[AUTH_COOKIE_NAME] as unknown;

  if (typeof token !== "string" || token.length === 0) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication token is required",
    });

    return;
  }

  let payload: JwtPayload;

  // Verify the JWT before trusting any claims.
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (typeof decoded === "string") {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid authentication token",
      });

      return;
    }

    payload = decoded;
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication token is invalid or expired",
    });

    return;
  }

  // Read the user ID from the verified token.
  const userId = payload.sub;

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid authentication token",
    });

    return;
  }

  // Confirm that the user still exists.
  const user = await User.findById(userId);

  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "User no longer exists",
    });

    return;
  }

  // Prevent suspended users from continuing.
  if (user.status !== "active") {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "This account is not active",
    });

    return;
  }

  // Attach the authenticated user to the request.
  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  next();
};
