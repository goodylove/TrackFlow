import { StatusCodes } from "http-status-codes";

export class AuthenticationError extends Error {
  public readonly statusCode = StatusCodes.UNAUTHORIZED;

  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class UserNotFoundError extends Error {
  public readonly statusCode = StatusCodes.NOT_FOUND;

  constructor(message = "User not found") {
    super(message);
    this.name = "UserNotFoundError";
  }
}
