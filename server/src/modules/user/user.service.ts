import bcrypt from "bcrypt";

import { User } from "./user.model.js";
import type { RegisterUserInput } from "./user.schema.js";

const SALT_ROUNDS = 12;

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("An account with this email already exists");
    this.name = "EmailAlreadyExistsError";
  }
}

export const registerUser = async (input: RegisterUserInput) => {
  const email = input.email.toLowerCase();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new EmailAlreadyExistsError();
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await User.create({
    name: input.name,
    email,
    passwordHash,
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    status: user.status,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
};