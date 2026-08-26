import { model, Schema, Types } from "mongoose";

export const ISSUE_STATUSES = [
  "todo",
  "in_progress",
  "done",
] as const;

export type IssueStatus =
  (typeof ISSUE_STATUSES)[number];

export const ISSUE_PRIORITIES = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export type IssuePriority =
  (typeof ISSUE_PRIORITIES)[number];

export interface IIssue {
  workspace: Types.ObjectId;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  reporter: Types.ObjectId;
  assignee?: Types.ObjectId;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IIssue>(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: undefined,
    },

    status: {
      type: String,
      enum: ISSUE_STATUSES,
      default: "todo",
      index: true,
    },

    priority: {
      type: String,
      enum: ISSUE_PRIORITIES,
      default: "medium",
      index: true,
    },

    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: undefined,
      index: true,
    },

    dueDate: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

issueSchema.index({
  workspace: 1,
  createdAt: -1,
});

export const Issue = model<IIssue>(
  "Issue",
  issueSchema,
);