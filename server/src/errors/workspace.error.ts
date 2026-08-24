export class WorkspaceAlreadyExistsError extends Error {
    constructor() {
        super("You already have a workspace with this name");
        this.name = "WorkspaceAlreadyExistsError";
    }
}