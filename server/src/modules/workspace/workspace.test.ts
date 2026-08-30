import { describe, expect, it } from "vitest";
import app from "../../app.js";
import request from "supertest";
import { login, LoginUserB, UserData, UserDataB } from "../../test/auth.helper.js";

describe("Create workspace flow", () => {
  const data = {
    name: "just testing workspace",
    description: "this is for testing ",
  };

  it("create workspace successfully", async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    const loginResponse = await request(app).post("/api/v1/users/login").send(login);

    const token = loginResponse.body.data.user.token;

    const response = await request(app)
      .post("/api/v1/workspaces")
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      message: "Workspace created successfully",
    });
    expect(response.body).toHaveProperty("data");
  });

  it("membership protection", async () => {
    // User A register and login and token;
    await request(app).post("/api/v1/users/register").send(UserData);
    const loginResponseA = await request(app).post("/api/v1/users/login").send(login);

    const tokenA = loginResponseA.body.data.user.token;

    // User B register and login and token;

    await request(app).post("/api/v1/users/register").send(UserDataB);
    const loginResponseB = await request(app)
      .post("/api/v1/users/login")
      .send(LoginUserB);

    const tokenB = loginResponseB.body.data.user.token;

    // UserA creates a workspace

    const response = await request(app)
      .post("/api/v1/workspaces")
      .send(data)
      .set("Authorization", `Bearer ${tokenA}`);

    //store userA workspace ID

    const workspaceId = response.body.data._id;

    // user userB token to get workspace of userA

    const getWorkspaceResponse = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(getWorkspaceResponse.status).toBe(403);
    expect(getWorkspaceResponse.body).toMatchObject({
      success: false,
    });
  });
});
