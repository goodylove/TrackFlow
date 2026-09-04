export class WorkspaceAlreadyExistsError extends Error {
  constructor() {
    super("You already have a workspace with this name");
    this.name = "WorkspaceAlreadyExistsError";
  }
}

export class WorkspaceNotFoundError extends Error {
  constructor() {
    super("Workspace not found");
    this.name = "WorkspaceNotFoundError";
  }
}

// add error for existing member

export class ExistingMemberError extends Error {
  constructor() {
    super("This user is already a workspace member");
    this.name = "ExistingMemberError";
  }
}

export class WorkspaceRolePermissionError extends Error {
  constructor(message = "You do not have permission to assign this role") {
    super(message);
    this.name = "WorkspaceRolePermissionError";
  }
}

export class InvalidWorkspaceMemberIdError extends Error {
  constructor() {
    super("A valid workspace member ID is required");
    this.name = "InvalidWorkspaceMemberIdError";
  }
}

export class WorkspaceMemberNotFoundError extends Error {
  constructor() {
    super("Workspace member not found");
    this.name = "WorkspaceMemberNotFoundError";
  }
}
