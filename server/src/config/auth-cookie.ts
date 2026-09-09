import type { CookieOptions } from "express";

import { env } from "./env.js";
import { REMEMBERED_COOKIE_MAX_AGE_MS } from "./auth-session.js";

export const AUTH_COOKIE_NAME = "trackflow_session";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  path: "/api/v1",
  sameSite: env.COOKIE_SAME_SITE,
  secure: env.NODE_ENV === "production" || env.COOKIE_SAME_SITE === "none",
};

export const getAuthCookieOptions = (remember: boolean): CookieOptions =>
  remember
    ? { ...baseCookieOptions, maxAge: REMEMBERED_COOKIE_MAX_AGE_MS }
    : { ...baseCookieOptions };

export const authCookieClearOptions: CookieOptions = baseCookieOptions;
