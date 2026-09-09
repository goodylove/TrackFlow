# TrackFlow API Reference

This reference describes the current server implementation. Paths below are
relative to `http://localhost:5000/api/v1`, except the server-root welcome route.
Send request bodies as JSON with `Content-Type: application/json`.

## Contents

- [Environments](#environments)
- [Authentication and credentials](#authentication-and-credentials)
- [CORS and CSRF](#cors-and-csrf)
- [PowerShell quick start](#powershell-quick-start)
- [Response conventions and errors](#response-conventions-and-errors)
- [Health](#health)
- [Users](#users)
- [Workspaces and members](#workspaces-and-members)
- [Issues](#issues)
- [Comments](#comments)
- [Dashboard](#dashboard)
- [Deletion reliability](#deletion-reliability)
- [Testing](#testing)
- [Implementation references](#implementation-references)

## Environments

- Development: `http://localhost:5000/api/v1`
- Production: configured after deployment

Configure the backend using environment variables; see [.env.example](../.env.example).
Do not commit real secrets. The server validates configuration before starting.

| Variable | Required/default | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Required, nonempty | MongoDB connection string; use a replica set or sharded deployment for atomic cascades |
| `JWT_SECRET` | Required, nonempty | Signing secret; deploy with a long, randomly generated secret |
| `NODE_ENV` | `development` | `development`, `test`, or `production`; production enables secure cookies |
| `PORT` | `5000` | Integer from 1 to 65535 |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Exact trusted frontend HTTP(S) origin, including any port, with no path, trailing slash, credentials, query, or fragment |
| `COOKIE_SAME_SITE` | `lax` | `lax` for same-site hosting; explicitly select `none` for cross-site HTTPS hosting |

Production requires an HTTPS `CLIENT_ORIGIN`. `COOKIE_SAME_SITE=none` also
requires an HTTPS frontend and always sets `Secure`, regardless of `NODE_ENV`.
The API itself must be served over HTTPS in production and in cross-site mode.
The frontend's `VITE_API_URL` must point to the deployed API base including `/api/v1`.

| Deployment example (not deployed URLs) | Backend settings |
| --- | --- |
| `http://localhost:5173` and `http://localhost:5000` | `NODE_ENV=development`, `CLIENT_ORIGIN=http://localhost:5173`, `COOKIE_SAME_SITE=lax` |
| `https://app.example.com` and `https://api.example.com` | `NODE_ENV=production`, `CLIENT_ORIGIN=https://app.example.com`, `COOKIE_SAME_SITE=lax` |
| `https://trackflow.vercel.app` and `https://trackflow-api.onrender.com` | `NODE_ENV=production`, `CLIENT_ORIGIN=https://trackflow.vercel.app`, `COOKIE_SAME_SITE=none` |

Different origins can still be the same site: localhost ports and HTTPS sibling
subdomains can use Lax. Genuinely cross-site requests need `SameSite=None; Secure`.
Browser third-party cookie restrictions may still block cross-site authentication;
verify the selected deployment in supported browsers. No production domains are
hard-coded, and cross-site mode is never selected automatically.

## Authentication and credentials

Login sets the `trackflow_session` cookie. Protected endpoints read this cookie;
they do not read an `Authorization: Bearer` header. Login returns the user in
the response body without the JWT. Registration creates an account but does not
start a session.

The cookie uses `HttpOnly`, `Path=/api/v1`, configurable `SameSite` (default Lax),
and `Secure` in production or when SameSite is None. No `Domain` attribute is
set: the cookie belongs to the API host. The browser manages the cookie;
authentication tokens never appear in response bodies or Web Storage.

| Login mode | JWT lifetime | Cookie lifetime |
| --- | --- | --- |
| `remember: false` (default) | Seven days | Session cookie, with no explicit `Max-Age` or `Expires` |
| `remember: true` | 30 days | 30 days (`Max-Age=2592000` seconds) |

Both remembered lifetimes derive from shared duration constants. Browser session
restoration may retain session cookies, but the JWT expiry still applies.

`POST /users/logout` clears the cookie with matching options and does not require
authentication. It does not revoke an already issued JWT on the server.
Login, logout, and current-user responses include `Cache-Control: no-store`.

Both frontend Axios clients already set `withCredentials: true`:

```ts
import { apiClient, publicApiClient } from "@/lib/api/api-client"

await publicApiClient.post("/users/login", {
  email: "alex@example.com",
  password: "example-password-123",
  remember: false,
})

const { data } = await apiClient.get("/users/currentUser")
// data.data.user contains the signed-in user.
```

Protected routes require an existing user whose status is `active`. A missing,
invalid, or expired cookie returns `401`; an inactive account returns `403`.
Every route containing `:workspaceId` also requires membership of that workspace.
In the tables below, **Member** includes `owner`, `admin`, and `member` roles.

## CORS and CSRF

Both Axios clients use `withCredentials: true`. Express CORS runs before the
routes with `credentials: true` and permits only the exact `CLIENT_ORIGIN`;
it never uses a wildcard. Allowed preflight requests return `204`. Untrusted
origins receive no `Access-Control-Allow-Origin` header. CORS restricts browser
response access; it is not, by itself, CSRF protection.

Separate middleware protects all state-changing `/api/v1` requests, including
registration, login, and logout. Methods other than GET, HEAD, and OPTIONS:

- Reject a supplied `Origin` unless it exactly matches `CLIENT_ORIGIN`.
- Reject the literal `Origin: null`, including opaque/sandboxed browser origins.
- With `COOKIE_SAME_SITE=none`, reject a missing `Origin` as well.
- With Lax, allow requests without `Origin` for CLI/Supertest compatibility,
  but reject those marked `Sec-Fetch-Site: cross-site`.

Rejections return `403` with `{"success":false,"message":"Untrusted request origin"}`
before route handlers run. Browsers supply Origin automatically for frontend
mutations; Axios needs no custom CSRF-token header. CLI clients in cross-site
mode must explicitly send `Origin: <configured CLIENT_ORIGIN>` as well as their
cookie. There is no CSRF-token endpoint. Do not strip Origin at the reverse proxy.
Lax mode also relies on browser SameSite cookie restrictions for requests whose
Origin is absent; it does not establish a CLI client's identity. Authentication
and workspace permissions are always checked independently.

## PowerShell quick start

Start the server first using the [server setup](../README.md#run-locally).
This example creates an account, workspace, and issue in the connected database.
Choose an unused email when registering, or skip registration for an existing
account and use its credentials.

```powershell
$apiBase = 'http://localhost:5000/api/v1'
$credentials = @{
  email = 'alex@example.com'
  password = 'example-password-123'
}

$registration = @{
  name = 'Alex'
  email = $credentials.email
  password = $credentials.password
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$apiBase/users/register" -ContentType 'application/json' -Body $registration

$login = $credentials | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$apiBase/users/login" -ContentType 'application/json' -Body $login -SessionVariable trackflowSession
Invoke-RestMethod -Uri "$apiBase/users/currentUser" -WebSession $trackflowSession

$workspaceBody = @{ name = 'Demo workspace'; description = 'API walkthrough' } | ConvertTo-Json
$workspaceResponse = Invoke-RestMethod -Method Post -Uri "$apiBase/workspaces" -WebSession $trackflowSession -ContentType 'application/json' -Body $workspaceBody
$workspaceId = $workspaceResponse.data._id

$issueBody = @{ title = 'Verify cookie login'; assigneeId = $null } | ConvertTo-Json
$issueResponse = Invoke-RestMethod -Method Post -Uri "$apiBase/workspaces/$workspaceId/issues" -WebSession $trackflowSession -ContentType 'application/json' -Body $issueBody
Invoke-RestMethod -Uri "$apiBase/workspaces/$workspaceId/issues?page=1&limit=10" -WebSession $trackflowSession

Invoke-RestMethod -Method Post -Uri "$apiBase/users/logout" -WebSession $trackflowSession
```

## Response conventions and errors

Most successful requests return:

```json
{
  "success": true,
  "message": "Human-readable result",
  "data": {}
}
```

The `data` shape varies by endpoint, as listed below. Delete and logout responses
omit `data`. Health and welcome responses use `status: "success"` instead of
the `success` boolean. Dates serialize as ISO strings; MongoDB document IDs use
`_id`. User objects returned by authentication endpoints use `id`; populated
user documents can include both `_id` and the `id` virtual.

Validation failures return `400`, for example:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "body": ["Name must contain at least 2 characters"]
  }
}
```

The current validators wrap inputs in `body` or `query`, so flattened errors
are grouped under those keys. Issue-filter validation uses the message
`Invalid filters`; comment pagination uses `Invalid pagination parameters`.

Other errors include `success: false` and `message`. Errors from the centralized
handler also include `status: "error"`; middleware responses may omit `status`.

| HTTP status | Current uses |
| --- | --- |
| `200` | Successful reads, updates, deletes, login, logout, and member addition |
| `201` | User, workspace, issue, or comment created |
| `400` | Invalid body/query, malformed resource/assignee ID, invalid assignee membership, or reassignment of a completed issue |
| `401` | Invalid login credentials or missing/invalid/expired authentication cookie |
| `403` | Inactive account, missing membership, insufficient role, or untrusted/missing request origin under the CSRF policy |
| `404` | Missing resource, unknown route, or comment edit/delete by a different author |
| `409` | Email already registered, duplicate workspace name for its creator, or user already a workspace member |
| `500` | Unhandled server error |
| `503` | Readiness reports MongoDB disconnected |

Send 24-character hexadecimal MongoDB ObjectId strings. After authentication,
route IDs are validated before membership and role checks. Malformed
`workspaceId`, `issueId`, `commentId`, `memberId`, and supplied `assigneeId`
(body or filter) consistently return `400` with this shape:

```json
{"success":false,"message":"Invalid issue ID"}
```

The label is `workspace`, `issue`, `comment`, `member`, or `assignee` as appropriate.
Missing required body fields retain the usual validation-error shape. Valid IDs
for nonexistent workspaces return `404`; an existing workspace without the
caller's membership returns `403`. Child resources are scoped to the requested
workspace and return `404` when absent or belonging to another workspace.
Comment ownership intentionally hides inaccessible comments with `404`.

## Health

| Method | Path | Access | Response |
| --- | --- | --- | --- |
| GET | `/health` | Public | `200`, `{"message":"API is healthy","status":"success"}` |
| GET | `/ready` | Public | `200`, `{"message":"API is ready","status":"success"}` when connected; otherwise `503`, `{"message":"API is not ready","status":"error"}` |
| GET | `/` (server root, outside `/api/v1`) | Public | `200`, `{"message":"Welcome to the TrackFlow API","status":"success"}` |

Health and readiness responses include `Cache-Control: no-store`. `/health` is
the lightweight liveness check: it confirms the HTTP server responds even if
MongoDB is unavailable. `/ready` checks Mongoose's current connection state;
it does not perform a database query or guarantee future queries will succeed.
Neither endpoint exposes connection strings or infrastructure details.

## Users

| Method | Path | Access | Success body |
| --- | --- | --- | --- |
| POST | `/users/register` | Public | `201`, `data: { user }` |
| POST | `/users/login` | Public | `200`, `data: { user }`, plus session cookie |
| POST | `/users/logout` | Public | `200`, success/message only; clears session cookie |
| GET | `/users/currentUser` | Authenticated | `200`, `data: { user: { id, name, email } }` |

### Register

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "example-password-123"
}
```

All three fields are required. `name` is trimmed and must contain 2–80
characters. `email` is trimmed, nonempty, at most 255 characters, validated for
email format, then lowercased. Malformed registration or login emails return
`400` before the service or database is called.
`password` must contain 8–72 characters and is not trimmed.

The returned user has `id`, `name`, `email`, `status`, `isEmailVerified`, and
`createdAt`. Duplicate email returns `409`.

### Login

```json
{
  "email": "alex@example.com",
  "password": "example-password-123",
  "remember": true
}
```

Email and password have the same constraints as registration. `remember` is an
optional boolean defaulting to `false`. The returned user has the registration
response fields plus `lastLoginAt`. Incorrect credentials return `401`.
Logout takes no body. Current-user retrieval takes no body or query parameters.

## Workspaces and members

| Method | Path | Access | Success `data` |
| --- | --- | --- | --- |
| POST | `/workspaces` | Authenticated | `201`, workspace document |
| GET | `/workspaces` | Authenticated | `200`, array of the caller's membership documents with populated workspaces |
| GET | `/workspaces/:workspaceId` | Member | `200`, workspace document |
| DELETE | `/workspaces/:workspaceId` | Owner | `200`, no `data` |
| GET | `/workspaces/:workspaceId/members` | Member | `200`, array of membership documents with populated users |
| POST | `/workspaces/:workspaceId/members` | Owner/admin | `200`, membership document with populated user |
| PATCH | `/workspaces/:workspaceId/members/:memberId/role` | Owner | `200`, membership document |
| DELETE | `/workspaces/:workspaceId/members/:memberId` | Owner/admin | `200`, no `data` |

### Create and retrieve workspaces

```json
{
  "name": "Engineering",
  "description": "Product development and bug tracking"
}
```

`name` is required, trimmed, and 2–80 characters. `description` is required by
the request schema, trimmed, and at most 300 characters; an empty string is
allowed. Creation adds the caller as `owner`. Duplicate names for the same
creator are compared case-insensitively and return `409`.

A workspace contains `_id`, `name`, `description`, `createdBy`, `createdAt`, and
`updatedAt`. The workspace list returns memberships for all workspaces the caller
belongs to, ordered by membership creation time descending. Each membership has
`_id`, `workspace`, `user`, `role`, `joinedAt`, `createdAt`, and `updatedAt`.
Its populated `workspace` additionally includes `memberCount` and `openIssueCount`
(issues whose status is not `done`). A missing referenced workspace can be `null`.
The list is not paginated and is empty when the user has no memberships.

Owner-authorized workspace deletion removes its comments, issues, memberships,
then the workspace. All child deletes are scoped to that workspace. See
[deletion reliability](#deletion-reliability) for transaction and standalone behavior.

### Add a member

```json
{
  "email": "sam@example.com",
  "role": "member"
}
```

`email` is required, trimmed, validated as an email, and lowercased. `role` is
`admin` or `member`, defaulting to `member`. The user must already be registered
(`404` otherwise); this endpoint does not send an invitation. Existing membership
returns `409`. An admin can add members; only the owner can add an admin.

Membership list results populate `user` with `_id`, `name`, `email`, `status`,
`isEmailVerified`, and `avatarUrl` when present. Addition returns a populated user
without selecting `isEmailVerified`. Role updates return an unpopulated user ID.
The member list is sorted by `joinedAt`, then `createdAt`, ascending.

### Change a role or remove a member

`:memberId` is the **membership document's `_id`**, not the user's ID.
Role changes take `{"role":"admin"}` or `{"role":"member"}`. The owner's
role cannot be changed and the owner cannot be removed. An admin cannot remove
another admin. Missing membership returns `404`; invalid membership ID returns
`400`; forbidden role operations return `403`. Removing a member takes no body.

## Issues

| Method | Path | Access | Success `data` |
| --- | --- | --- | --- |
| POST | `/workspaces/:workspaceId/issues` | Member | `201`, issue document |
| GET | `/workspaces/:workspaceId/issues` | Member | `200`, `{ issues, pagination }` |
| GET | `/workspaces/:workspaceId/issues/:issueId` | Member | `200`, issue document |
| PATCH | `/workspaces/:workspaceId/issues/:issueId` | Member | `200`, `{ issue }` |
| PATCH | `/workspaces/:workspaceId/issues/:issueId/assignee` | Member | `200`, issue document |
| DELETE | `/workspaces/:workspaceId/issues/:issueId` | Owner/admin | `200`, no `data` |

An issue contains `_id`, `workspace`, `title`, optional `description`, `status`,
`priority`, `reporter`, `assignee`, optional `dueDate`, `createdAt`, and `updatedAt`.
Statuses are `todo`, `in_progress`, and `done`. Priorities are `low`, `medium`,
`high`, and `urgent`.

### Create an issue

```json
{
  "title": "Fix login redirect",
  "description": "Return users to their requested workspace after login.",
  "status": "todo",
  "priority": "high",
  "assigneeId": null,
  "dueDate": "2026-10-01T12:00:00.000Z"
}
```

| Field | Required | Validation/default |
| --- | --- | --- |
| `title` | Yes | Trimmed string, 2–150 characters |
| `description` | No | Trimmed string, at most 5,000 characters |
| `status` | No | Status enum; defaults to `todo` |
| `priority` | No | Priority enum; defaults to `medium` |
| `assigneeId` | Yes | Workspace member's **user ID**, or `null` for unassigned |
| `dueDate` | No | Value coercible to a date; use an ISO date-time string |

The reporter is the authenticated user. A non-null assignee must belong to the
workspace or the API returns `400`. Creation returns reporter/assignee IDs.

### List and filter issues

Example: `/workspaces/:workspaceId/issues?search=login&status=todo&page=1&limit=10`.

| Query | Validation/default |
| --- | --- |
| `search` | Optional trimmed string, 1–150 characters; case-insensitive literal partial match on title |
| `status` | Optional status enum |
| `priority` | Optional priority enum |
| `assigneeId` | Optional valid user ObjectId; no `null`/unassigned filter |
| `page` | Integer at least 1; defaults to 1 |
| `limit` | Integer from 1–100; defaults to 10 |

Filters are combined. Results sort by `createdAt` descending, then `_id`
descending. Each issue includes `commentCount`; `reporter` and `assignee` are
populated with `_id`, `name`, `email`, `status`, and `avatarUrl` when present.
Unassigned or missing referenced users can be `null`. Single-issue GET uses the
same user population but does not add `commentCount`.

Example empty response:

```json
{
  "success": true,
  "message": "Issues retrieved successfully",
  "data": {
    "issues": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalIssues": 0,
      "totalPages": 0,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

### Update details

```json
{
  "status": "in_progress",
  "priority": "urgent",
  "dueDate": null
}
```

Supply at least one of `title`, `description`, `status`, `priority`, or `dueDate`.
Text lengths and enums match creation. For updates, `dueDate` accepts an ISO UTC
date-time string (for example `2026-10-01T12:00:00.000Z`) or `null` to clear it.
An empty description clears its text. Assignment uses the separate endpoint.
The response nests the updated document under `data.issue`.

### Assign or unassign

Send `{"assigneeId":"<userId>"}` to assign a workspace member, or
`{"assigneeId":null}` to remove the assignee. The field is required.
For issues marked `done`, both assignment and unassignment return `400`.
Detail updates can change the status before reassignment.

Assignment returns the issue directly in `data`, with the assignee populated
with `_id`, `name`, `email`, and `avatarUrl` when present. Unassignment returns
`assignee: null`. Owner/admin-authorized issue deletion confirms the issue belongs
to the workspace, deletes comments matching both workspace and issue, then deletes
the issue. Other issues and their comments are retained.

## Comments

| Method | Path | Access | Success `data` |
| --- | --- | --- | --- |
| POST | `/workspaces/:workspaceId/issues/:issueId/comments` | Member | `201`, comment document |
| GET | `/workspaces/:workspaceId/issues/:issueId/comments` | Member | `200`, `{ comments, pagination }` |
| PATCH | `/workspaces/:workspaceId/issues/:issueId/comments/:commentId` | Member and comment author | `200`, comment document |
| DELETE | `/workspaces/:workspaceId/issues/:issueId/comments/:commentId` | Member and comment author | `200`, no `data` |

Creation and editing both require:

```json
{
  "content": "Verified the redirect in the latest build."
}
```

`content` is trimmed and must contain 1–5,000 characters. The issue must belong
to the workspace. Only the original author can edit/delete a comment, including
when the caller is an owner or admin. Missing comments, mismatched IDs, and
another author's comments return `404`; malformed issue/comment IDs return `400`.

A comment contains `_id`, `workspace`, `issue`, `author`, `content`, `createdAt`,
`updatedAt`, and the Mongoose version field `__v`. Creation populates `author`
with `_id`, `name`, and `email`; list/update additionally select `status` and
`avatarUrl` when present.

Listing accepts `page` (integer at least 1, default 1) and `limit` (integer
1–100, default 10). Results sort by `createdAt` descending, then `_id` descending.

```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": {
    "comments": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalComments": 0,
      "totalPages": 0,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

For both paginated lists, `totalPages` is the total count divided by `limit`,
rounded up. Pages beyond the last page return an empty array; they are not
clamped. `hasPreviousPage` reflects whether the requested page is greater than 1.

## Dashboard

| Method | Path | Access | Success `data` |
| --- | --- | --- | --- |
| GET | `/workspaces/:workspaceId/dashboard/stats` | Member | `200`, workspace issue statistics |

No query parameters or body are required. Example response:

```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalIssues": 3,
    "byStatus": { "todo": 2, "done": 1 },
    "byPriority": { "medium": 2, "high": 1 },
    "assignedIssues": 1,
    "unassignedIssues": 2,
    "overdueIssues": 1
  }
}
```

`byStatus` and `byPriority` contain only groups present in the workspace; absent
groups are omitted. An empty workspace returns zero counts and empty group
objects. Overdue issues have a due date before the current server time and a
status other than `done`.

## Deletion reliability

Cascade deletion detects MongoDB topology with `hello` before making changes.
On replica sets and sharded deployments with session support, the reads and
deletes run in a transaction; a failure rolls the transaction back. Operations
inside the transaction are sequential. Errors propagate to the caller; a failed
transaction is never silently rerun without a transaction.

Standalone MongoDB does not support multi-document transactions. To preserve
local compatibility, deletion runs sequentially with children first and the
parent last. This fallback is **not atomic**: a failure may leave a partial
deletion. Retry after fixing the database failure; if workspace memberships were
already removed before the final workspace delete failed, administrator recovery
may be required. Neither this fallback nor the existing creation routes coordinate
concurrent child creation with deletion. Avoid concurrent writes during deletion;
strict coordination across those operations would need a broader lifecycle change.
Use a replica set for production atomicity of the cascade's own operations.

## Testing

From `server/`, run `npm run typecheck`, `npm run lint`, `npm test`, and
`npm run build`. Tests start isolated MongoDB instances with
`mongodb-memory-server`; they do not connect to the application's `MONGODB_URI`.
Test-only environment values override deployment configuration. Cleanup is guarded
by the isolated database's connection state and name.

The default suite uses standalone MongoDB. To also exercise real transaction
commit and rollback on a temporary single-node replica set in PowerShell:

```powershell
$env:TEST_MONGODB_REPLICA_SET = '1'
try {
  npm test -- src/test/resource-security.test.ts
} finally {
  Remove-Item Env:TEST_MONGODB_REPLICA_SET
}
```

`TEST_MONGODB_REPLICA_SET` is a test-runner switch, not a deployment setting.
Integration coverage includes authentication, cookie lifetimes, logout,
input validation, CORS/origin checks, roles, malformed IDs, cascade isolation,
failure behavior, dashboard statistics, and liveness/readiness.

## Implementation references

- [Route mounts and CORS](../src/app.ts)
- [Environment configuration](../src/config/env.ts) and [cookie options](../src/config/auth-cookie.ts)
- [Session duration constants](../src/config/auth-session.ts) and [CSRF origin checks](../src/middleware/csrf.middleware.ts)
- [Resource ID validation](../src/middleware/object-id.middleware.ts) and [transaction support](../src/utils/transaction.ts)
- [Authentication](../src/middleware/auth.middleware.ts), [membership](../src/middleware/workspace-membership.middleware.ts), and [role checks](../src/middleware/workspace-role.middleware.ts)
- [Users](../src/modules/user/user.routes.ts) and [user validation](../src/modules/user/user.schema.ts)
- [Workspaces](../src/modules/workspace/workspace.routes.ts) and [workspace validation](../src/modules/workspace/workspace.schema.ts)
- [Issues](../src/modules/issue/issue.routes.ts) and [issue validation](../src/modules/issue/issue.schema.ts)
- [Comments](../src/modules/comment/comment.routes.ts) and [comment validation](../src/modules/comment/comment.schema.ts)
- [Dashboard statistics](../src/modules/dashboard/dashboard.service.ts)
- [Error handling](../src/middleware/errorHandler.ts)
