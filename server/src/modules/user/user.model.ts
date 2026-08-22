import { Schema, Types, model } from "mongoose";
import type { HydratedDocument } from "mongoose";

export const USER_STATUSES = ["active", "suspended"] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  defaultWorkspace?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;


const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      maxlength: 255,

    },
    passwordHash: {
      type: String,
      required: true,

      select: false,
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: undefined,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: "active",
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: undefined,
    },
    passwordChangedAt: {
      type: Date,
      default: undefined,
    },
    // defaultWorkspace: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Workspace",
    //   default: undefined,
    //   index: true,
    // },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Partial<IUser> & { _id?: Types.ObjectId; id?: string }) => {
        delete ret.passwordHash;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: Partial<IUser>) => {
        delete ret.passwordHash;
        return ret;
      },
    },
  },
);



export const User = model<IUser>("User", UserSchema);
