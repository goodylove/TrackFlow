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
    super("This is an already existing member");
    this.name = "ExistingMemberError";
  }
}
