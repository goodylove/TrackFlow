import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { User } from "./user.model.js";
import { getAuthCookie, login, UserData } from "../../test/auth.helper.js";

describe("Register flows works as expected", () => {
  it("Successful registration", async () => {
    const response = await request(app).post("/api/v1/users/register").send(UserData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      message: "Account created successfully",
    });
    expect(response.body.data.user.email).toBe("goodyc@gmail.com");
    expect(response.body.data.user).not.toHaveProperty("password");
    expect(response.body.data.user).not.toHaveProperty("passwordHash");
  });

  it("Duplicate email", async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    const response = await request(app).post("/api/v1/users/register").send(UserData);

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      success: false,
      message: "An account with this email already exists",
    });
  });

  it("Invalid input", async () => {
    const data = {
      name: "",
      email: "goodyc@gmail.com",
      password: "wghejhfjjghfjw",
    };

    const response = await request(app).post("/api/v1/users/register").send(data);
    const userCount = await User.countDocuments({
      email: data.email,
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
    });

    expect(userCount).toBe(0);
  });

  //   const data = {
  //     email: "goodyc@gmail.com",
  //     password: "wghejhfjjghfjw",
  //   };
});

describe("Login flows works as expected", () => {
  const data = {
    name: "Goodness",
    email: "goodyc@gmail.com",
    password: "wghejhfjjghfjw",
  };

  const login = {
    email: "goodyc@gmail.com",
    password: "wghejhfjjghfjw",
  };
  it("Successful login", async () => {
    await request(app).post("/api/v1/users/register").send(data);

    const response = await request(app).post("/api/v1/users/login").send(login);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Login successful",
    });
    expect(response.body.data.user.email).toBe("goodyc@gmail.com");
    expect(response.body.data.user).not.toHaveProperty("password");
    expect(response.body.data.user).not.toHaveProperty("passwordHash");
    expect(response.body.data.user).not.toHaveProperty("token");
    expect(getAuthCookie(response)).toEqual(expect.stringContaining("trackflow_session="));
    expect(response.headers["set-cookie"]?.[0]).toContain("HttpOnly");
    expect(response.headers["set-cookie"]?.[0]).toContain("SameSite=Lax");
    expect(response.headers["set-cookie"]?.[0]).toContain("Path=/api/v1");
  });
  it("Email does not exist", async () => {
    const login = {
      email: "goodyc33@gmail.com",
      password: "wghejhfjjghfjw",
    };
    await request(app).post("/api/v1/users/register").send(data);

    const response = await request(app).post("/api/v1/users/login").send(login);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      status: "error",
      message: "Invalid email or password",
    });

    expect(response.body).not.toHaveProperty("data");
  });
});

describe("Protected Routes", () => {
  it("Unauthenticated user is not allowed to have access to workspace routes", async () => {
    const invalidCookie = "trackflow_session=not-a-valid-token";

    const response = await request(app)
      .get("/api/v1/workspaces")
      .set("Cookie", invalidCookie);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      message: "Authentication token is invalid or expired",
    });
  });

  it("No authentication cookie returns 401", async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    await request(app).post("/api/v1/users/login").send(login);

    const response = await request(app).get("/api/v1/workspaces");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      message: "Authentication token is required",
    });
  });

  it("authenticated user is allowed to have access to workspace routes with Valid JWT ", async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    const loginResponseB = await request(app).post("/api/v1/users/login").send(login);

    const token = getAuthCookie(loginResponseB);

    const response = await request(app)
      .get("/api/v1/workspaces")
      .set("Cookie", token);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Workspaces retrieved successfully",
    });

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("clears the cookie on logout and ends the session", async () => {
    const agent = request.agent(app);

    await request(app).post("/api/v1/users/register").send(UserData);
    await agent.post("/api/v1/users/login").send(login).expect(200);
    await agent.get("/api/v1/users/currentUser").expect(200);

    const logoutResponse = await agent.post("/api/v1/users/logout");

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.headers["set-cookie"]?.[0]).toContain(
      "trackflow_session=;",
    );
    await agent.get("/api/v1/users/currentUser").expect(401);
  });
});
