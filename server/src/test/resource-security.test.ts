import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { env } from "../config/env.js";
import { User } from "../modules/user/user.model.js";
import { Workspace } from "../modules/workspace/workspace.model.js";
import { WorkspaceMember } from "../modules/workspace/workspace-member.model.js";
import { Issue } from "../modules/issue/issue.modal.js";
import { Comment } from "../modules/comment/comment.model.js";

afterEach(() => vi.restoreAllMocks());

const fixture = async () => {
  // Only fixture setup bypasses HTTP; every behavior under test uses the real router.
  const owner = await User.create({
    name: "Owner",
    email: "owner@example.com",
    passwordHash: "unused",
  });
  const member = await User.create({
    name: "Member",
    email: "member@example.com",
    passwordHash: "unused",
  });
  const workspaces = await Workspace.create([
    { name: "First", createdBy: owner._id },
    { name: "Other", createdBy: owner._id },
  ]);
  const first = workspaces[0]!;
  const other = workspaces[1]!;
  await WorkspaceMember.create([
    { workspace: first._id, user: owner._id, role: "owner" },
    { workspace: other._id, user: owner._id, role: "owner" },
    { workspace: first._id, user: member._id, role: "member" },
  ]);
  const issues = await Issue.create([
    { workspace: first._id, title: "First issue", reporter: owner._id },
    { workspace: first._id, title: "Sibling issue", reporter: owner._id },
    { workspace: other._id, title: "Other issue", reporter: owner._id },
  ]);
  const comments = await Comment.create(
    issues.map((issue) => ({
      workspace: issue.workspace,
      issue: issue._id,
      author: owner._id,
      content: "Keep scoped",
    })),
  );
  const cookie = (id: Types.ObjectId) =>
    "trackflow_session=" +
    jwt.sign({ sub: id.toString() }, env.JWT_SECRET, { expiresIn: 60 });
  return {
    first,
    other,
    issue: issues[0]!,
    sibling: issues[1]!,
    otherIssue: issues[2]!,
    comment: comments[0]!,
    owner,
    member,
    ownerCookie: cookie(owner._id),
    memberCookie: cookie(member._id),
    base: "/api/v1/workspaces/" + first._id.toString(),
  };
};

describe("Resource IDs and isolation", () => {
  it("rejects malformed route IDs before membership lookup and role checks", async () => {
    const f = await fixture();
    const id = f.issue._id.toString();
    const memberLookup = vi.spyOn(WorkspaceMember, "findOne");
    const cases: Array<["get" | "post" | "patch" | "delete", string, string]> = [
      ["get", "/not-an-id", "workspace"],
      ["delete", "/not-an-id", "workspace"],
      ["post", "/not-an-id/members", "workspace"],
      ["get", "/" + f.first._id + "/issues/bad", "issue"],
      ["patch", "/" + f.first._id + "/issues/bad", "issue"],
      ["delete", "/" + f.first._id + "/issues/bad", "issue"],
      ["patch", "/" + f.first._id + "/issues/bad/assignee", "issue"],
      ["get", "/" + f.first._id + "/issues/bad/comments", "issue"],
      ["post", "/" + f.first._id + "/issues/bad/comments", "issue"],
      ["patch", "/" + f.first._id + "/issues/bad/comments/" + f.comment._id, "issue"],
      ["delete", "/" + f.first._id + "/issues/bad/comments/" + f.comment._id, "issue"],
      ["patch", "/" + f.first._id + "/issues/" + id + "/comments/bad", "comment"],
      ["delete", "/" + f.first._id + "/issues/" + id + "/comments/bad", "comment"],
      ["patch", "/" + f.first._id + "/members/bad/role", "member"],
      ["delete", "/" + f.first._id + "/members/bad", "member"],
      ["get", "/bad/dashboard/stats", "workspace"],
    ];
    for (const cookie of [f.ownerCookie, f.memberCookie]) {
      for (const [method, path, label] of cases) {
        const response = await request(app)[method]("/api/v1/workspaces" + path)
          .set("Cookie", cookie)
          .send({
            title: "Changed",
            content: "Changed",
            role: "member",
            assigneeId: null,
          })
          .expect(400);
        expect(response.body).toEqual({
          success: false,
          message: "Invalid " + label + " ID",
        });
      }
    }
    expect(memberLookup).not.toHaveBeenCalled();
  });

  it.each(["bad", 123, {}, ["bad"], "a".repeat(23), "z".repeat(24)])(
    "rejects malformed body assignee IDs: %j",
    async (assigneeId) => {
      const f = await fixture();
      for (const [method, path] of [
        ["post", f.base + "/issues"],
        ["patch", f.base + "/issues/" + f.issue._id + "/assignee"],
      ] as const) {
        const response = await request(app)[method](path)
          .set("Cookie", f.ownerCookie)
          .send({ title: "Invalid assignment", assigneeId })
          .expect(400);
        expect(response.body).toEqual({ success: false, message: "Invalid assignee ID" });
      }
      expect(await Issue.countDocuments({ workspace: f.first._id })).toBe(2);
    },
  );

  it("rejects malformed assignee filters", async () => {
    const f = await fixture();
    for (const query of [
      "assigneeId=bad",
      "assigneeId=bad&assigneeId=other",
      "assigneeId=null",
    ]) {
      const response = await request(app)
        .get(f.base + "/issues?" + query)
        .set("Cookie", f.ownerCookie)
        .expect(400);
      expect(response.body).toEqual({ success: false, message: "Invalid assignee ID" });
    }
  });

  it("uses 404 for missing resources and 403 for existing workspaces without membership", async () => {
    const f = await fixture();
    await request(app)
      .get("/api/v1/workspaces/" + new Types.ObjectId())
      .set("Cookie", f.ownerCookie)
      .expect(404);
    await request(app)
      .get("/api/v1/workspaces/" + f.other._id)
      .set("Cookie", f.memberCookie)
      .expect(403);
    for (const [method, path] of [
      ["get", f.base + "/issues/" + f.otherIssue._id],
      ["patch", f.base + "/issues/" + f.otherIssue._id],
      ["delete", f.base + "/issues/" + f.otherIssue._id],
      ["patch", f.base + "/issues/" + f.otherIssue._id + "/assignee"],
      ["post", f.base + "/issues/" + f.otherIssue._id + "/comments"],
      ["get", f.base + "/issues/" + f.otherIssue._id + "/comments"],
      ["delete", f.base + "/members/" + new Types.ObjectId()],
    ] as const) {
      await request(app)[method](path)
        .set("Cookie", f.ownerCookie)
        .send({ title: "Changed", content: "Changed", assigneeId: null })
        .expect(404);
    }
    expect(await Comment.countDocuments({ workspace: f.other._id })).toBe(1);
    expect(await Issue.exists({ _id: f.otherIssue._id })).not.toBeNull();
  });

  it("preserves dashboard aggregation and combined filters within a workspace", async () => {
    const f = await fixture();
    await Issue.updateOne(
      { _id: f.issue._id },
      {
        status: "in_progress",
        priority: "high",
        assignee: f.owner._id,
        dueDate: new Date(0),
      },
    );
    await Issue.updateOne({ _id: f.sibling._id }, { status: "done" });
    const stats = await request(app)
      .get(f.base + "/dashboard/stats")
      .set("Cookie", f.ownerCookie)
      .expect(200);
    expect(stats.body.data).toEqual({
      totalIssues: 2,
      byStatus: { in_progress: 1, done: 1 },
      byPriority: { high: 1, medium: 1 },
      assignedIssues: 1,
      unassignedIssues: 1,
      overdueIssues: 1,
    });
    const filtered = await request(app)
      .get(f.base + "/issues")
      .set("Cookie", f.ownerCookie)
      .query({
        search: "First",
        status: "in_progress",
        priority: "high",
        assigneeId: f.owner._id.toString(),
        page: 1,
        limit: 1,
      })
      .expect(200);
    expect(filtered.body.data.issues).toHaveLength(1);
    expect(filtered.body.data.issues[0]._id).toBe(f.issue._id.toString());
    expect(filtered.body.data.pagination).toMatchObject({
      totalIssues: 1,
      totalPages: 1,
    });
    await request(app)
      .patch(f.base + "/issues/" + f.sibling._id + "/assignee")
      .set("Cookie", f.ownerCookie)
      .send({ assigneeId: null })
      .expect(400);
  });
});

describe("Deletion cascades", () => {
  it("deletes a workspace's children and memberships while keeping another workspace intact", async () => {
    const f = await fixture();
    const response = await request(app)
      .delete(f.base)
      .set("Cookie", f.ownerCookie)
      .expect(200);
    expect(response.body).toEqual({
      success: true,
      message: "Workspace deleted successfully",
    });
    for (const [workspace, expected] of [
      [f.first._id, 0],
      [f.other._id, 1],
    ] as const) {
      expect(await Comment.countDocuments({ workspace })).toBe(expected);
      expect(await Issue.countDocuments({ workspace })).toBe(expected);
      expect(await WorkspaceMember.countDocuments({ workspace })).toBe(expected);
    }
    expect(await Workspace.exists({ _id: f.first._id })).toBeNull();
    expect(await Workspace.exists({ _id: f.other._id })).not.toBeNull();
    expect(await User.countDocuments()).toBe(2);
  });

  it("deletes only an issue and its comments, retaining sibling and other workspace records", async () => {
    const f = await fixture();
    const response = await request(app)
      .delete(f.base + "/issues/" + f.issue._id)
      .set("Cookie", f.ownerCookie)
      .expect(200);
    expect(response.body).toEqual({
      success: true,
      message: "Issue deleted successfully",
    });
    expect(await Issue.exists({ _id: f.issue._id })).toBeNull();
    expect(
      await Comment.countDocuments({ workspace: f.first._id, issue: f.issue._id }),
    ).toBe(0);
    expect(
      await Comment.countDocuments({ workspace: f.first._id, issue: f.sibling._id }),
    ).toBe(1);
    expect(await Comment.countDocuments({ workspace: f.other._id })).toBe(1);
    expect(await Issue.countDocuments()).toBe(2);
    expect(await Workspace.countDocuments()).toBe(2);
    expect(await WorkspaceMember.countDocuments()).toBe(3);
  });

  it("denies cascades before deleting any records when the requester lacks the role", async () => {
    const f = await fixture();
    await request(app).delete(f.base).set("Cookie", f.memberCookie).expect(403);
    await request(app)
      .delete(f.base + "/issues/" + f.issue._id)
      .set("Cookie", f.memberCookie)
      .expect(403);
    await WorkspaceMember.updateOne(
      { workspace: f.first._id, user: f.member._id },
      { role: "admin" },
    );
    await request(app).delete(f.base).set("Cookie", f.memberCookie).expect(403);
    expect(await Comment.countDocuments()).toBe(3);
    expect(await Issue.countDocuments()).toBe(3);
    expect(await WorkspaceMember.countDocuments()).toBe(3);
    await request(app)
      .delete(f.base + "/issues/" + f.issue._id)
      .set("Cookie", f.memberCookie)
      .expect(200);
  });

  it.each(["workspace", "issue"] as const)(
    "propagates %s cascade failures and rolls back on replica sets",
    async (resource) => {
      const f = await fixture();
      const hello = await mongoose.connection.db!.admin().command({ hello: 1 });
      const transactional = typeof hello.setName === "string";
      // Fail after comments have been deleted, without simulating a successful write.
      const failure = { status: 503, message: "Simulated database failure" };
      if (resource === "workspace") {
        vi.spyOn(Issue, "deleteMany").mockImplementationOnce(() => {
          throw failure;
        });
      } else {
        vi.spyOn(Issue, "deleteOne").mockImplementationOnce(() => {
          throw failure;
        });
      }
      const path = resource === "workspace" ? f.base : f.base + "/issues/" + f.issue._id;
      await request(app).delete(path).set("Cookie", f.ownerCookie).expect(503);
      expect(await Workspace.exists({ _id: f.first._id })).not.toBeNull();
      expect(await Issue.exists({ _id: f.issue._id })).not.toBeNull();
      expect(await WorkspaceMember.countDocuments({ workspace: f.first._id })).toBe(2);
      expect(await Comment.countDocuments({ workspace: f.first._id })).toBe(
        transactional ? 2 : resource === "workspace" ? 0 : 1,
      );
      expect(await Comment.countDocuments({ workspace: f.other._id })).toBe(1);
      vi.restoreAllMocks();
      await request(app).delete(path).set("Cookie", f.ownerCookie).expect(200);
    },
  );
});
