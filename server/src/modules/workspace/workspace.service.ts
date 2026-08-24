import { StatusCodes } from "http-status-codes";
import { WorkspaceMember } from "./workspace-member.model.js";
import { Workspace } from "./workspace.model.js";
import type { createWorkSpaceInput } from "./workspace.schema.js";
import { WorkspaceAlreadyExistsError } from "../../errors/workspace.error.js";

export const createWorkSpace = async (input: createWorkSpaceInput, userId: string) => {
    const name = input.name.trim();

    const existingWorkspace = await Workspace.findOne({ name, createdBy: userId }).collation({ locale: "en", strength: 2 });

    if (existingWorkspace) {
        throw new WorkspaceAlreadyExistsError();
    }

    const workspace = await Workspace.create({
        name: input.name,
        description: input.description,
        createdBy: userId,
    })

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

    if (!membership || membership.length === 0) {
        throw {
            status: StatusCodes.NOT_FOUND,
            message: "No workspaces found for the user",
        };
    }
    return membership;
};
