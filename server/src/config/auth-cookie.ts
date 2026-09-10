import type { CookieOptions } from "express";


import { REMEMBERED_COOKIE_MAX_AGE_MS } from "./auth-session.js";

export const AUTH_COOKIE_NAME = "trackflow_session";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
};

export const getAuthCookieOptions = (remember: boolean): CookieOptions =>
  remember
    ? { ...baseCookieOptions, maxAge: REMEMBERED_COOKIE_MAX_AGE_MS }
    : { ...baseCookieOptions };

export const authCookieClearOptions: CookieOptions = baseCookieOptions;
