import type { RequestHandler } from "express";
import { env } from "../config/env.js";

export const verifyRequestOrigin: RequestHandler = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }

  const origin = req.get("Origin");
  // Cross-site cookies require an Origin even for non-browser clients.
  // Lax mode keeps CLI clients working; opaque and untrusted origins fail closed.
  if (
    (origin !== undefined && origin !== env.CLIENT_ORIGIN) ||
    (origin === undefined &&
      (env.COOKIE_SAME_SITE === "none" || req.get("Sec-Fetch-Site") === "cross-site"))
  ) {
    res.status(403).json({ success: false, message: "Untrusted request origin" });
    return;
  }

  next();
};
