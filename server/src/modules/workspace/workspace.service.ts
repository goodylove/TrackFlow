import { StatusCodes } from "http-status-codes";
import { WorkspaceMember, type WorkspaceRole } from "./workspace-member.model.js";
import { Workspace } from "./workspace.model.js";
import type {
  AddWorkspaceMemberInput,
  createWorkSpaceInput,
} from "./workspace.schema.js";
import { WorkspaceAlreadyExistsError } from "../../errors/workspace.error.js";
import { User } from "../user/user.model.js";
import { UserNotFoundError } from "../../errors/authentication.error.js";

type AssignableWorkspaceRole = "admin" | "member";

export const createWorkSpace = async (input: createWorkSpaceInput, userId: string) => {
  const name = input.name.trim();

  const existingWorkspace = await Workspace.findOne({
    name,
    createdBy: userId,
  }).collation({ locale: "en", strength: 2 });

  if (existingWorkspace) {
    throw new WorkspaceAlreadyExistsError();
  }

  const workspace = await Workspace.create({
    name: input.name,
    description: input.description,
    createdBy: userId,
  });

  await WorkspaceMember.create({
    workspace: workspace._id,
    user: userId,
    role: "owner",
  });

  return workspace;
};

export const getWorkspacesByUserId = async (userId: string) => {
  const membership = await WorkspaceMember.find({ user: userId })
    .populate({
      path: "workspace",
      select: "name description createdBy createdAt updatedAt",
    })
    .sort({ createdAt: -1 });

  if (!membership) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "No workspaces found for the user",
    };
  }
  return membership;
};

export const getWorkspaceById = async (workspaceId: string) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Workspace not found",
    };
  }

  return workspace;
};

export const getWorkspaceMembers = async (workspaceId: string) => {
  const members = await WorkspaceMember.find({ workspace: workspaceId })
    .populate({
      path: "user",
      select: "name email avatarUrl status isEmailVerified",
    })
    .sort({ joinedAt: 1, createdAt: 1 });

  return members;
};

export const deleteWorkspace = async (workspaceId: string) => {
  const workspace = await Workspace.findByIdAndDelete(workspaceId);

  if (!workspace) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Workspace not found",
    };
  }

  await WorkspaceMember.deleteMany({
    workspace: workspaceId,
  });
  return workspace;
};

export const addWorkspaceMember = async (
  workspaceId: string,
  input: AddWorkspaceMemberInput,
  role: WorkspaceRole,
) => {
  const user = await User.findOne({ email: input.email });
  console.log("user", user, input.email);

  if (!user) {
    throw new UserNotFoundError();
  }

  const existingMember = await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: user._id,
  });

  if (existingMember) {
    throw {
      status: StatusCodes.CONFLICT,
      message: "This user is already a workspace member",
    };
  }

  if (role === "admin" && input.role === "admin") {
    throw {
      status: StatusCodes.FORBIDDEN,
      message: "Only the workspace owner can add an admin",
    };
  }

  const membership = await WorkspaceMember.create({
    workspace: workspaceId,
    user: user._id,
    role: input.role,
  });

  await membership.populate({
    path: "user",
    select: "name email avatarUrl status ",
  });

  return membership;
};

export const changeWorkspaceMemberRole = async (
  workspaceId: string,
  memberId: string,
  inputRole: AssignableWorkspaceRole,
) => {
  const workspaceMember = await WorkspaceMember.findOne({
    workspace: workspaceId,
    _id: memberId,
  });

  if (!workspaceMember) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Workspace member not found",
    };
  }

  if (workspaceMember.role === "owner") {
    throw {
      status: StatusCodes.FORBIDDEN,
      message: "The workspace owner's role cannot be changed",
    };
  }

  workspaceMember.role = inputRole;
  await workspaceMember.save();

  return workspaceMember;
};

export const removeWorkspaceMember = async (
  workspaceId: string,
  workspaceMemberId: string,
  actorRole: WorkspaceRole,
) => {
  const workspaceMember = await WorkspaceMember.findOne({
    _id: workspaceMemberId,
    workspace: workspaceId,
  });

  if (!workspaceMember) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Workspace member not found",
    };
  }

  if (workspaceMember.role == "owner") {
    throw {
      status: StatusCodes.FORBIDDEN,
      message: "The workspace owner cannot be removed",
    };
  }


  if (actorRole === "admin" && workspaceMember?.role === "admin") {
     throw {
       status: StatusCodes.FORBIDDEN,
       message: "An admin cannot remove another admin",
     };

  }
  await workspaceMember.deleteOne()
  
  return workspaceMember;
};
