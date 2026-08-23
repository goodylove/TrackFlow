import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "./user.model.js";
import type { LoginUserInput, RegisterUserInput } from "./user.schema.js";

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET!;

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

export const loginUser = async (input: LoginUserInput) => {
  const email = input.email.toLowerCase();

  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user) {
    throw new Error("Invalid email");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Incorrect password");
  }

  const token = jwt.sign(
    {
      sub: user._id.toString(),
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
  user.lastLoginAt = new Date();
  await user.save();

  return {
    token,
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    status: user.status,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,

  };
};
