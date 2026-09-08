import type { CookieOptions } from "express";

import { env } from "./env.js";

export const AUTH_COOKIE_NAME = "trackflow_session";

const THIRTY_DAYS_IN_MS = 8 * 24 * 60 * 60 * 1000;

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  path: "/api/v1",
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
};

export const getAuthCookieOptions = (remember: boolean): CookieOptions =>
  remember
    ? { ...baseCookieOptions, maxAge: THIRTY_DAYS_IN_MS }
    : { ...baseCookieOptions };

export const authCookieClearOptions: CookieOptions = baseCookieOptions;
