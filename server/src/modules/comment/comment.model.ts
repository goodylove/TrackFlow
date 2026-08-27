import { model, Schema, Types } from "mongoose";

export interface IComment {
  workspace: Types.ObjectId;
  issue: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    issue: {
      type: Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
      index: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

commentSchema.index({
  workspace: 1,
  issue: 1,
  createdAt: -1,
});

export const Comment = model<IComment>("Comment", commentSchema);
