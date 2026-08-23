import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { User } from "../modules/user/user.model.js";
import { StatusCodes } from "http-status-codes";



export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    // 1. Read the Authorization header
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Authentication token is required",
        });

        return;
    }

    // 2. Separate "Bearer" from the token
    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Use the format: Bearer <token>",
        });

        return;
    }

    // 3. Make sure the JWT secret exists
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
    }

    let payload: JwtPayload;

    // 4. Verify the JWT
    try {
        const decoded = jwt.verify(token, jwtSecret);

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

    // 5. Read the user ID from the token
    const userId = payload.sub

    if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Invalid authentication token",
        });

        return;
    }

    // 6. Confirm that the user still exists
    const user = await User.findById(userId);

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "User no longer exists",
        });

        return;
    }

    // 7. Prevent suspended users from continuing
    if (user.status !== "active") {
        res.status(StatusCodes.FORBIDDEN).json({
            success: false,
            message: "This account is not active",
        });

        return;
    }

    // 8. Attach the authenticated user to the request
    req.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
    };

    // 9. Continue to the controller
    next();
};