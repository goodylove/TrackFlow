import type { NextFunction, Request, Response } from "express";

import { registerUserSchema } from "./user.schema.js";
import {
  EmailAlreadyExistsError,
  registerUser,
} from "./user.service.js";

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = registerUserSchema.safeParse({
      body: req.body,
    });

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });

      return;
    }

    const user = await registerUser(result.data.body);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      res.status(409).json({
        success: false,
        message: error.message,
      });

      return;
    }

    next(error);
  }
};