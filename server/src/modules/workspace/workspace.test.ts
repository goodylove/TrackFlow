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

  it("returns workspace card metrics", async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    await request(app).post("/api/v1/users/register").send(UserDataB);
    const loginResponse = await request(app).post("/api/v1/users/login").send(login);
    const token = loginResponse.body.data.user.token;
    const workspaceResponse = await request(app)
      .post("/api/v1/workspaces")
      .send(data)
      .set("Authorization", `Bearer ${token}`);
    const workspaceId = workspaceResponse.body.data._id;

    await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/members`)
      .send({ email: UserDataB.email, role: "member" })
      .set("Authorization", `Bearer ${token}`);
    await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/issues`)
      .send({
        title: "Open issue",
        status: "todo",
        priority: "medium",
        assigneeId: null,
      })
      .set("Authorization", `Bearer ${token}`);
    await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/issues`)
      .send({
        title: "Completed issue",
        status: "done",
        priority: "low",
        assigneeId: null,
      })
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .get("/api/v1/workspaces")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data[0].workspace).toMatchObject({
      _id: workspaceId,
      memberCount: 2,
      openIssueCount: 1,
    });
    expect(response.body.data[0].workspace.createdAt).toEqual(expect.any(String));
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

  it("allows an owner to add an existing user and rejects duplicates", async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    await request(app).post("/api/v1/users/register").send(UserDataB);

    const loginResponse = await request(app).post("/api/v1/users/login").send(login);
    const token = loginResponse.body.data.user.token;
    const workspaceResponse = await request(app)
      .post("/api/v1/workspaces")
      .send(data)
      .set("Authorization", `Bearer ${token}`);
    const workspaceId = workspaceResponse.body.data._id;
    const memberInput = { email: UserDataB.email, role: "member" };

    const addMemberResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/members`)
      .send(memberInput)
      .set("Authorization", `Bearer ${token}`);

    expect(addMemberResponse.status).toBe(200);
    expect(addMemberResponse.body).toMatchObject({
      success: true,
      message: "Member added successfully",
      data: {
        role: "member",
        user: {
          email: UserDataB.email,
          name: UserDataB.name,
        },
      },
    });

    const duplicateResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/members`)
      .send(memberInput)
      .set("Authorization", `Bearer ${token}`);

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body).toMatchObject({
      success: false,
      message: "This user is already a workspace member",
    });
  });

  it("allows an owner to change a member role while protecting the owner role", async () => {
    await request(app).post("/api/v1/users/register").send(UserData);
    await request(app).post("/api/v1/users/register").send(UserDataB);

    const loginResponse = await request(app).post("/api/v1/users/login").send(login);
    const token = loginResponse.body.data.user.token;
    const workspaceResponse = await request(app)
      .post("/api/v1/workspaces")
      .send(data)
      .set("Authorization", `Bearer ${token}`);
    const workspaceId = workspaceResponse.body.data._id;
    const addMemberResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/members`)
      .send({ email: UserDataB.email, role: "member" })
      .set("Authorization", `Bearer ${token}`);
    const memberId = addMemberResponse.body.data._id;

    const updateResponse = await request(app)
      .patch(`/api/v1/workspaces/${workspaceId}/members/${memberId}/role`)
      .send({ role: "admin" })
      .set("Authorization", `Bearer ${token}`);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject({
      success: true,
      message: "Member role  updated successfully",
      data: { _id: memberId, role: "admin" },
    });

    const membersResponse = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/members`)
      .set("Authorization", `Bearer ${token}`);
    const ownerMembership = membersResponse.body.data.find(
      (membership: { role: string }) => membership.role === "owner",
    );
    const ownerUpdateResponse = await request(app)
      .patch(
        `/api/v1/workspaces/${workspaceId}/members/${ownerMembership._id}/role`,
      )
      .send({ role: "member" })
      .set("Authorization", `Bearer ${token}`);

    expect(ownerUpdateResponse.status).toBe(403);
    expect(ownerUpdateResponse.body).toMatchObject({
      success: false,
      message: "The workspace owner's role cannot be changed",
    });

    const invalidIdResponse = await request(app)
      .patch(`/api/v1/workspaces/${workspaceId}/members/not-an-id/role`)
      .send({ role: "member" })
      .set("Authorization", `Bearer ${token}`);

    expect(invalidIdResponse.status).toBe(400);
    expect(invalidIdResponse.body).toMatchObject({
      success: false,
      message: "A valid workspace member ID is required",
    });
  });

  it("removes members according to owner and admin permissions", async () => {
    const userDataC = {
      name: "Chiamaka",
      email: "chiamaka@example.com",
      password: "a-secure-password-123",
    };

    await request(app).post("/api/v1/users/register").send(UserData);
    await request(app).post("/api/v1/users/register").send(UserDataB);
    await request(app).post("/api/v1/users/register").send(userDataC);

    const ownerLoginResponse = await request(app)
      .post("/api/v1/users/login")
      .send(login);
    const ownerToken = ownerLoginResponse.body.data.user.token;
    const workspaceResponse = await request(app)
      .post("/api/v1/workspaces")
      .send(data)
      .set("Authorization", `Bearer ${ownerToken}`);
    const workspaceId = workspaceResponse.body.data._id;
    const adminResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/members`)
      .send({ email: UserDataB.email, role: "admin" })
      .set("Authorization", `Bearer ${ownerToken}`);
    const memberResponse = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/members`)
      .send({ email: userDataC.email, role: "member" })
      .set("Authorization", `Bearer ${ownerToken}`);
    const adminMembershipId = adminResponse.body.data._id;
    const memberMembershipId = memberResponse.body.data._id;

    const adminLoginResponse = await request(app)
      .post("/api/v1/users/login")
      .send(LoginUserB);
    const adminToken = adminLoginResponse.body.data.user.token;
    const removeMemberResponse = await request(app)
      .delete(
        `/api/v1/workspaces/${workspaceId}/members/${memberMembershipId}`,
      )
      .set("Authorization", `Bearer ${adminToken}`);

    expect(removeMemberResponse.status).toBe(200);
    expect(removeMemberResponse.body).toMatchObject({
      success: true,
      message: "Workspace membership removed successfully",
    });

    const adminRemovesAdminResponse = await request(app)
      .delete(
        `/api/v1/workspaces/${workspaceId}/members/${adminMembershipId}`,
      )
      .set("Authorization", `Bearer ${adminToken}`);

    expect(adminRemovesAdminResponse.status).toBe(403);
    expect(adminRemovesAdminResponse.body).toMatchObject({
      success: false,
      message: "An admin cannot remove another admin",
    });

    const ownerRemovesAdminResponse = await request(app)
      .delete(
        `/api/v1/workspaces/${workspaceId}/members/${adminMembershipId}`,
      )
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(ownerRemovesAdminResponse.status).toBe(200);

    const membersResponse = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/members`)
      .set("Authorization", `Bearer ${ownerToken}`);
    const ownerMembership = membersResponse.body.data.find(
      (membership: { role: string }) => membership.role === "owner",
    );
    const removeOwnerResponse = await request(app)
      .delete(
        `/api/v1/workspaces/${workspaceId}/members/${ownerMembership._id}`,
      )
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(removeOwnerResponse.status).toBe(403);
    expect(removeOwnerResponse.body).toMatchObject({
      success: false,
      message: "The workspace owner cannot be removed",
    });

    const invalidIdResponse = await request(app)
      .delete(`/api/v1/workspaces/${workspaceId}/members/not-an-id`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(invalidIdResponse.status).toBe(400);
    expect(invalidIdResponse.body).toMatchObject({
      success: false,
      message: "A valid workspace member ID is required",
    });
  });
});
