import { StatusCodes } from "http-status-codes";

export class AuthenticationError extends Error {
    public readonly statusCode = StatusCodes.UNAUTHORIZED;

    constructor(message = "Authentication required") {
        super(message);
        this.name = "AuthenticationError";
    }
}