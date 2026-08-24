import type { Request, Response } from "express";
import { createWorkspaceSchema } from "./workspace.schema.js";
import { StatusCodes } from "http-status-codes";
import { createWorkSpace, getWorkspacesByUserId, } from "./workspace.service.js";

export const workspaceController = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Authentication required",
        });

        return;
    }

    const result = createWorkspaceSchema.safeParse({
        body: req.body,
    });

    if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Validation failed",
            errors: result.error.flatten().fieldErrors,
        });
        return;
    }

    const workspace = await createWorkSpace(result.data.body, req.user.id);

    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Workspace created successfully",
        data: workspace,
    });
};



export const getWorkspacesController = async (req: Request, res: Response) => {

    if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Authentication required",
        });
        return;
    }
    const workspaces = await getWorkspacesByUserId(req.user.id);


    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Workspaces retrieved successfully",
        data: workspaces,
    });
}
