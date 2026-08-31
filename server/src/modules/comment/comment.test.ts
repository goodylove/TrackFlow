import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../app.js";
import { login, LoginUserB, UserData, UserDataB } from "../../test/auth.helper.js";

describe("Comment API integration tests", () => {
  const workspaceData = {
    name: "just testing workspace",
    description: "this is for testing ",
  };

  const setupCommentOwnershipScenario = async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    const loginResponseA = await request(app).post("/api/v1/users/login").send(login);
    const tokenA = loginResponseA.body.data.user.token;

    await request(app).post("/api/v1/users/register").send(UserDataB);
    const loginResponseB = await request(app)
      .post("/api/v1/users/login")
      .send(LoginUserB);
    const tokenB = loginResponseB.body.data.user.token;

    const workspaceResponse = await request(app)
      .post("/api/v1/workspaces")
      .send(workspaceData)
      .set("Authorization", `Bearer ${tokenA}`);

    const workspaceId = workspaceResponse.body.data._id;

    const addMemberResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/members`)
      .send({
        email: UserDataB.email,
        role: "member",
      })
      .set("Authorization", `Bearer ${tokenA}`);

    expect(addMemberResponse.status).toBe(200);

    const createIssueResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/issues`)
      .send({
        title: "just testing",
        description: "just still testing ooo",
        status: "todo",
        priority: "medium",
        assigneeId: null,
      })
      .set("Authorization", `Bearer ${tokenA}`);

    const issueId = createIssueResponse.body.data._id;

    const createCommentResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/issues/${issueId}/comments`)
      .send({
        content: "owner comment",
      })
      .set("Authorization", `Bearer ${tokenA}`);

    const commentId = createCommentResponse.body.data._id;

    return {
      commentId,
      issueId,
      tokenA,
      tokenB,
      workspaceId,
    };
  };

  it("prevents a workspace member from updating another user's comment", async () => {
    const { workspaceId, issueId, commentId, tokenB } =
      await setupCommentOwnershipScenario();

    const response = await request(app)
      .patch(`/api/v1/workspaces/${workspaceId}/issues/${issueId}/comments/${commentId}`)
      .send({
        content: "updated by another member",
      })
      .set("Authorization", `Bearer ${tokenB}`);

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      success: false,
      status: "error",
    });
  });

  it("prevents a workspace member from deleting another user's comment", async () => {
    const { workspaceId, issueId, commentId, tokenB } =
      await setupCommentOwnershipScenario();

    const response = await request(app)
      .delete(`/api/v1/workspaces/${workspaceId}/issues/${issueId}/comments/${commentId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      success: false,
      status: "error",
    });
  });
});
