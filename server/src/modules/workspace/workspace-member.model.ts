import { model, Schema, Types } from "mongoose";

export const WORKSPACE_ROLES = [
    "owner",
    "admin",
    "member",
] as const;

export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

export interface IWorkspaceMember {
    workspace: Types.ObjectId;
    user: Types.ObjectId;
    role: WorkspaceRole;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
    {
        workspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        role: {
            type: String,
            enum: WORKSPACE_ROLES,
            required: true,
            default: "member",
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// A user can only have one membership record in each workspace
workspaceMemberSchema.index(
    {
        workspace: 1,
        user: 1,
    },
    {
        unique: true,
    },
);

export const WorkspaceMember = model<IWorkspaceMember>(
    "WorkspaceMember",
    workspaceMemberSchema,
);