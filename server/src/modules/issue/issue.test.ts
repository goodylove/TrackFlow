import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { login, LoginUserB, UserData, UserDataB } from "../../test/auth.helper.js";

describe("Issue API integration tests", () => {
  const data = {
    name: "just testing workspace",
    description: "this is for testing ",
  };

  it("allows a workspace member to create an issue", async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    const workspaceMember = await request(app).post("/api/v1/users/login").send(login);

    const token = workspaceMember.body.data.user.token;

    const workspaceResponse = await request(app)
      .post("/api/v1/workspaces")
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    const workspaceId = workspaceResponse.body.data._id;
    // const createdById = workspaceResponse.body.data.createdBy;

    const response = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/issues`)
      .send({
        title: "just testing",
        description: "just still testing ooo",
        status: "todo",
        priority: "medium",
        assigneeId: null,
      })
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);
    // console.log(response.error.issues);

    expect(response.status).toBe(201);
  });

  it("returns issues belonging to the workspace", async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    const workspaceMember = await request(app).post("/api/v1/users/login").send(login);

    const token = workspaceMember.body.data.user.token;

    const workspaceResponse = await request(app)
      .post("/api/v1/workspaces")
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    const workspaceId = workspaceResponse.body.data._id;
    // const createdById = workspaceResponse.body.data.createdBy;

    await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/issues`)
      .send({
        title: "just testing",
        description: "just still testing ooo",
        status: "todo",
        priority: "medium",
        assigneeId: null,
      })
      .set("Authorization", `Bearer ${token}`);

    const issuesResponse = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/issues`)
      .set("Authorization", `Bearer ${token}`);

    expect(issuesResponse.status).toBe(200);
    expect(issuesResponse.body).toMatchObject({
      success: true,
      message: "Issues retrieved successfully",
    });
  });

  it("allows a workspace member to update an issue", async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    const workspaceMember = await request(app).post("/api/v1/users/login").send(login);

    const token = workspaceMember.body.data.user.token;

    const workspaceResponse = await request(app)
      .post("/api/v1/workspaces")
      .send(data)
      .set("Authorization", `Bearer ${token}`);

    const workspaceId = workspaceResponse.body.data._id;
    // const createdById = workspaceResponse.body.data.createdBy;

    const createIssueResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/issues`)
      .send({
        title: "just testing",
        description: "just still testing ooo",
        status: "todo",
        priority: "medium",
        assigneeId: null,
      })
      .set("Authorization", `Bearer ${token}`);

    const issueId = createIssueResponse.body.data._id;

    // const issuesResponse = await request(app)
    //   .get(`/api/v1/workspaces/${workspaceId}/issues/${issueId}`)
    //   .set("Authorization", `Bearer ${token}`);

    const updateIssueResponse = await request(app)
      .patch(`/api/v1/workspaces/${workspaceId}/issues/${issueId}`)
      .send({
        title: "just testing okoowoow",
        description: "just still testing ooo",
        status: "todo",
        priority: "medium",
      })
      .set("Authorization", `Bearer ${token}`);
    console.log(updateIssueResponse.body);
    expect(updateIssueResponse.status).toBe(200);
    expect(updateIssueResponse.body.data.issue.title).toEqual("just testing okoowoow");
  });

  it("rejects access from a non-member", async () => {
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

    const res = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/issues`)
      .send({
        title: "just testing",
        description: "just still testing ooo",
        status: "todo",
        priority: "medium",
        assigneeId: null,
      })
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({
      message: "You do not have permission to access this workspace",
      success: false,
    });
  });

  it("filters workspace issues by status", async () => {
    await request(app).post("/api/v1/users/register").send(UserData);

    const loginResponse = await request(app).post("/api/v1/users/login").send(login);

    const token = loginResponse.body.data.user.token;

    const workspaceResponse = await request(app)
      .post("/api/v1/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send(data);

    expect(workspaceResponse.status).toBe(201);

    const workspaceId = workspaceResponse.body.data._id;

    const todoIssueResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/issues`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Fix login page",
        description: "Fix login redirect problem",
        status: "todo",
        priority: "medium",
        assigneeId: null,
      });

    const inProgressIssueResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/issues`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Build dashboard",
        description: "Implement dashboard statistics",
        status: "in_progress",
        priority: "high",
        assigneeId: null,
      });
    console.log(todoIssueResponse.body);
    expect(todoIssueResponse.status).toBe(201);
    expect(inProgressIssueResponse.status).toBe(201);

    const response = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/issues?status=todo`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const issues = response.body.data.issues;
    console.log(issues);

    // expect(issues).toHaveLength(1);

    expect(issues.every((issue: { status: string }) => issue.status === "todo")).toBe(
      true,
    );

    expect(issues[0].title).toBe("Fix login page");
  });
});
