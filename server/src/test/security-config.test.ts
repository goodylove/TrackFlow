import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import { env, envSchema } from "../config/env.js";
import { User } from "../modules/user/user.model.js";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Cookie deployment, CORS and CSRF", () => {
  it("allows credentials only for the exact configured frontend origin", async () => {
    const response = await request(app)
      .options("/api/v1/users/login")
      .set("Origin", env.CLIENT_ORIGIN)
      .set("Access-Control-Request-Method", "POST");
    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(env.CLIENT_ORIGIN);
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
    for (const origin of [
      "https://evil.example",
      env.CLIENT_ORIGIN + ".evil.example",
      "null",
    ]) {
      const rejected = await request(app)
        .get("/api/v1/health")
        .set("Origin", origin)
        .expect(200);
      expect(rejected.headers["access-control-allow-origin"]).toBeUndefined();
    }
  });

  it.each(["https://evil.example", "http://localhost:5173.evil.example", "null"])(
    "blocks unsafe requests from %s before services",
    async (origin) => {
      const find = vi.spyOn(User, "findOne");
      for (const method of ["post", "patch", "put", "delete"] as const) {
        const response = await request(app)[method]("/api/v1/users/login")
          .set("Origin", origin)
          .send({})
          .expect(403);
        expect(response.body).toEqual({
          success: false,
          message: "Untrusted request origin",
        });
      }
      expect(find).not.toHaveBeenCalled();
    },
  );

  it("accepts trusted and non-browser Lax requests, but rejects cross-site fetches without Origin", async () => {
    await request(app)
      .post("/api/v1/users/logout")
      .set("Origin", env.CLIENT_ORIGIN)
      .expect(200);
    await request(app).post("/api/v1/users/logout").expect(200);
    await request(app)
      .post("/api/v1/users/logout")
      .set("Sec-Fetch-Site", "cross-site")
      .expect(403);
  });

  it.each([
    "*",
    "https://app.example.com/path",
    "https://app.example.com/",
    "ftp://app.example.com",
    "invalid-url",
    "https://user:pass@app.example.com",
  ])("rejects invalid origin configuration: %s", (CLIENT_ORIGIN) => {
    expect(envSchema.safeParse({ ...env, CLIENT_ORIGIN }).success).toBe(false);
  });

  it("requires HTTPS for production and SameSite=None and defaults to Lax", () => {
    expect(
      envSchema.parse({ JWT_SECRET: "test", MONGODB_URI: "test" }).COOKIE_SAME_SITE,
    ).toBe("lax");
    expect(envSchema.safeParse({ ...env, NODE_ENV: "production" }).success).toBe(false);
    expect(envSchema.safeParse({ ...env, COOKIE_SAME_SITE: "none" }).success).toBe(false);
    expect(envSchema.safeParse({ ...env, COOKIE_SAME_SITE: "unsafe" }).success).toBe(
      false,
    );
    expect(
      envSchema.safeParse({
        ...env,
        NODE_ENV: "production",
        CLIENT_ORIGIN: "https://app.example.com",
      }).success,
    ).toBe(true);
  });

  it.each(["lax", "none"] as const)(
    "sets and clears secure production cookies in %s mode",
    async (sameSite) => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("CLIENT_ORIGIN", "https://app.example.com");
      vi.stubEnv("COOKIE_SAME_SITE", sameSite);
      vi.resetModules();
      const cookies = await import("../config/auth-cookie.js");
      expect(cookies.getAuthCookieOptions(true)).toEqual({
        httpOnly: true,
        secure: true,
        sameSite,
        path: "/api/v1",
        maxAge: 2592000000,
      });
      expect(cookies.getAuthCookieOptions(false)).toEqual(cookies.authCookieClearOptions);
      expect(cookies.authCookieClearOptions).not.toHaveProperty("maxAge");
      const { verifyRequestOrigin } = await import("../middleware/csrf.middleware.js");
      const { default: express } = await import("express");
      const testApp = express();
      testApp.use(verifyRequestOrigin);
      testApp.post("/logout", (_req, res) => {
        res
          .clearCookie(cookies.AUTH_COOKIE_NAME, cookies.authCookieClearOptions)
          .sendStatus(200);
      });
      const cleared = await request(testApp)
        .post("/logout")
        .set("Origin", "https://app.example.com")
        .expect(200);
      expect(cleared.headers["set-cookie"]![0]).toContain("Secure");
      expect(cleared.headers["set-cookie"]![0]).toContain(
        sameSite === "none" ? "SameSite=None" : "SameSite=Lax",
      );
      await request(testApp)
        .post("/logout")
        .expect(sameSite === "none" ? 403 : 200);
      await request(testApp).post("/logout").set("Origin", "null").expect(403);
      await request(testApp)
        .post("/logout")
        .set("Origin", "https://evil.example")
        .expect(403);
    },
  );
});
