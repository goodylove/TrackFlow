import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt, { type JwtPayload } from "jsonwebtoken";
import app from "../../app.js";
import { env } from "../../config/env.js";
import { getAuthCookie, login, UserData } from "../../test/auth.helper.js";
import { User } from "./user.model.js";
import * as userService from "./user.service.js";

afterEach(() => vi.restoreAllMocks());

describe("Authentication security", () => {
  it.each([
    "not-an-email",
    "alex@",
    "@example.com",
    "alex@example",
    "a b@example.com",
    "a".repeat(256) + "@example.com",
  ])("rejects malformed email before services or database: %s", async (email) => {
    const register = vi.spyOn(userService, "registerUser");
    const loginService = vi.spyOn(userService, "loginUser");
    const find = vi.spyOn(User, "findOne");
    for (const endpoint of ["register", "login"]) {
      const response = await request(app)
        .post("/api/v1/users/" + endpoint)
        .send({ ...UserData, email });
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        message: "Validation failed",
      });
    }
    expect(register).not.toHaveBeenCalled();
    expect(loginService).not.toHaveBeenCalled();
    expect(find).not.toHaveBeenCalled();
    expect(await User.countDocuments()).toBe(0);
  });

  it.each([false, true])(
    "authenticates and aligns cookie/JWT expiry with remember=%s",
    async (remember) => {
      const agent = request.agent(app);
      const registration = await agent
        .post("/api/v1/users/register")
        .send({ ...UserData, email: "  GOODYC@GMAIL.COM  " })
        .expect(201);
      expect(registration.body.data.user.email).toBe(login.email);
      const response = await agent
        .post("/api/v1/users/login")
        .send({ ...login, email: "  GOODYC@GMAIL.COM  ", remember })
        .expect(200);
      const cookie = getAuthCookie(response);
      const token = cookie.slice(cookie.indexOf("=") + 1);
      const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      expect(payload.exp! - payload.iat!).toBe((remember ? 30 : 7) * 24 * 60 * 60);
      const header = response.headers["set-cookie"]![0];
      for (const option of ["HttpOnly", "SameSite=Lax", "Path=/api/v1"])
        expect(header).toContain(option);
      if (remember) {
        expect(header).toContain("Max-Age=2592000");
        expect(header).toContain("Expires=");
      } else {
        expect(header).not.toContain("Max-Age");
        expect(header).not.toContain("Expires=");
      }
      expect(response.body.data).not.toHaveProperty("token");
      expect(JSON.stringify(response.body)).not.toContain(token);
      expect(response.headers["cache-control"]).toBe("no-store");
      await agent.get("/api/v1/users/currentUser").expect(200);
      const logout = await agent.post("/api/v1/users/logout").expect(200);
      const cleared = logout.headers["set-cookie"]![0];
      for (const option of [
        "HttpOnly",
        "SameSite=Lax",
        "Path=/api/v1",
        "Expires=Thu, 01 Jan 1970",
      ])
        expect(cleared).toContain(option);
      expect(cleared).not.toContain("Max-Age");
      await agent.get("/api/v1/users/currentUser").expect(401);
      // Logout clears the browser cookie; it does not revoke a copied JWT.
      await request(app)
        .get("/api/v1/users/currentUser")
        .set("Cookie", cookie)
        .expect(200);
    },
  );

  it("rejects expired, malformed-subject, and deleted-user cookies", async () => {
    const registered = await request(app)
      .post("/api/v1/users/register")
      .send(UserData)
      .expect(201);
    const userId = registered.body.data.user.id as string;
    for (const token of [
      jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: -1 }),
      jwt.sign({ sub: "invalid-id" }, env.JWT_SECRET, { expiresIn: 60 }),
    ]) {
      await request(app)
        .get("/api/v1/users/currentUser")
        .set("Cookie", "trackflow_session=" + token)
        .expect(401);
    }
    const loggedIn = await request(app)
      .post("/api/v1/users/login")
      .send(login)
      .expect(200);
    await User.deleteOne({ _id: userId });
    await request(app)
      .get("/api/v1/users/currentUser")
      .set("Cookie", getAuthCookie(loggedIn))
      .expect(401);
  });

  it("denies an existing session after the user is suspended", async () => {
    await request(app).post("/api/v1/users/register").send(UserData).expect(201);
    const loggedIn = await request(app)
      .post("/api/v1/users/login")
      .send(login)
      .expect(200);
    await User.updateOne({ email: UserData.email }, { status: "suspended" });
    const response = await request(app)
      .get("/api/v1/users/currentUser")
      .set("Cookie", getAuthCookie(loggedIn))
      .expect(403);
    expect(response.body.message).toBe("This account is not active");
  });

  it("returns the same credential error for a wrong password", async () => {
    await request(app).post("/api/v1/users/register").send(UserData).expect(201);
    const response = await request(app)
      .post("/api/v1/users/login")
      .send({ ...login, password: "wrong-password" })
      .expect(401);
    expect(response.body.message).toBe("Invalid email or password");
    expect(response.headers["set-cookie"]).toBeUndefined();
  });
});
