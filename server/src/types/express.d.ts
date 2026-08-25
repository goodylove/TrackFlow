declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
      };
      workspaceMembership?: {
        workspaceId: string;
        role: "owner" | "admin" | "member";
      };
    }
  }
}

export {};
