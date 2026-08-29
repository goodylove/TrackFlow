import { StatusCodes } from "http-status-codes";

export class AuthenticationError extends Error {
  public readonly statusCode = StatusCodes.UNAUTHORIZED;

  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class InvalidCredentialsError extends Error {
  public readonly statusCode = StatusCodes.UNAUTHORIZED;

  constructor(message = "Invalid email or password") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class UserNotFoundError extends Error {
  public readonly statusCode = StatusCodes.NOT_FOUND;

  constructor(message = "User not found") {
    super(message);
    this.name = "UserNotFoundError";
  }
}
