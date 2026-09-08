import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../app.js";
import { getAuthCookie, login, LoginUserB, UserData, UserDataB } from "../../test/auth.helper.js";

describe("Comment API integration tests", () => {
  const workspaceData = {
    name: "just testing workspace",
    description: "this is for testing ",
  };

  const setupCommentOwnershipScenario = async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    const loginResponseA = await request(app).post("/api/v1/users/login").send(login);
    const tokenA = getAuthCookie(loginResponseA);

    await request(app).post("/api/v1/users/register").send(UserDataB);
    const loginResponseB = await request(app)
      .post("/api/v1/users/login")
      .send(LoginUserB);
    const tokenB = getAuthCookie(loginResponseB);

    const workspaceResponse = await request(app)
      .post("/api/v1/workspaces")
      .send(workspaceData)
      .set("Cookie", tokenA);

    const workspaceId = workspaceResponse.body.data._id;

    const addMemberResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/members`)
      .send({
        email: UserDataB.email,
        role: "member",
      })
      .set("Cookie", tokenA);

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
      .set("Cookie", tokenA);

    const issueId = createIssueResponse.body.data._id;

    const createCommentResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/issues/${issueId}/comments`)
      .send({
        content: "owner comment",
      })
      .set("Cookie", tokenA);

    expect(createCommentResponse.status).toBe(201);
    expect(createCommentResponse.body).toMatchObject({
      success: true,
      message: "Comment created successfully",
      data: {
        content: "owner comment",
        author: { email: UserData.email },
      },
    });

    const commentId = createCommentResponse.body.data._id;

    return {
      commentId,
      issueId,
      tokenA,
      tokenB,
      workspaceId,
    };
  };

  it("returns paginated comments for a workspace issue", async () => {
    const { workspaceId, issueId, tokenA } =
      await setupCommentOwnershipScenario();

    const response = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/issues/${issueId}/comments`)
      .query({ page: 1, limit: 10 })
      .set("Cookie", tokenA);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Comments retrieved successfully",
      data: {
        comments: [
          {
            content: "owner comment",
            author: { email: UserData.email },
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          totalComments: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });
  });

  it("allows an author to update their own comment", async () => {
    const { workspaceId, issueId, commentId, tokenA } =
      await setupCommentOwnershipScenario();

    const response = await request(app)
      .patch(`/api/v1/workspaces/${workspaceId}/issues/${issueId}/comments/${commentId}`)
      .send({ content: "updated owner comment" })
      .set("Cookie", tokenA);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Comment updated successfully",
      data: {
        content: "updated owner comment",
        author: { email: UserData.email },
      },
    });
  });

  it("prevents a workspace member from updating another user's comment", async () => {
    const { workspaceId, issueId, commentId, tokenB } =
      await setupCommentOwnershipScenario();

    const response = await request(app)
      .patch(`/api/v1/workspaces/${workspaceId}/issues/${issueId}/comments/${commentId}`)
      .send({
        content: "updated by another member",
      })
      .set("Cookie", tokenB);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      status: "error",
      message: "Comment not found or you are not allowed to update it",
    });
  });

  it("allows an author to delete their own comment", async () => {
    const { workspaceId, issueId, commentId, tokenA } =
      await setupCommentOwnershipScenario();

    const deleteResponse = await request(app)
      .delete(`/api/v1/workspaces/${workspaceId}/issues/${issueId}/comments/${commentId}`)
      .set("Cookie", tokenA);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toMatchObject({
      success: true,
      message: "Comment deleted successfully",
    });

    const listResponse = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/issues/${issueId}/comments`)
      .set("Cookie", tokenA);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toMatchObject({
      comments: [],
      pagination: {
        totalComments: 0,
        totalPages: 0,
      },
    });
  });

  it("prevents a workspace member from deleting another user's comment", async () => {
    const { workspaceId, issueId, commentId, tokenB } =
      await setupCommentOwnershipScenario();

    const response = await request(app)
      .delete(`/api/v1/workspaces/${workspaceId}/issues/${issueId}/comments/${commentId}`)
      .set("Cookie", tokenB);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      status: "error",
      message: "Comment not found or you are not allowed to delete it",
    });
  });
});
