import { model, Schema, Types } from "mongoose";

export interface IWorkspace {
    name: string;
    description?: string;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new Schema<IWorkspace>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 80,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 300,
            default: undefined,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const Workspace = model<IWorkspace>(
    "Workspace",
    workspaceSchema,
);