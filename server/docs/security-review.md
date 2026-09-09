# Backend security review

Implemented on 2026-09-08. The existing routes, feature modules, and successful
response shapes were preserved.

## Steps and reasons

1. Inspected routes, controllers, services, schemas, models, middleware, environment
   and cookie configuration, test setup, frontend credential handling, and the API
   reference. The starting Git diff was clean. The actual document is
   `server/docs/api.md`; its Markdown was already largely valid.
2. Corrected remembered authentication to 30 days for both JWT and cookie using
   shared constants. Normal JWTs remain seven days with a session cookie.
   Registration and login now share trimmed, length-limited, format-validated,
   lowercased email input. Tests prove invalid emails never call the service/database.
3. Added resource-ID middleware after authentication and before membership/role
   checks, including assignee body/filter validation. Malformed IDs return the
   requested 400 shape. Missing workspaces now return 404; existing workspaces
   without membership return 403. Verified JWT subjects are also validated before lookup.
4. Added authorized, scoped comment/issue/membership cascades. MongoDB topology is
   checked before writes. Replica sets use transactions; standalone instances use
   sequential child-first deletion. Real replica-set tests prove commit and rollback.
5. Added validated cookie deployment settings and separate Origin-based CSRF
   protection. Lax remains the default. None is explicit, requires HTTPS, and
   rejects state-changing requests without a trusted Origin. Added connection-state
   readiness while preserving lightweight liveness.
6. Updated the detailed API reference and environment example. Added isolated
   authentication, configuration, ID, cascade, failure, isolation, dashboard, and
   health coverage. Fixed failures found during verification and reran the affected checks.

## Files changed

All paths below are relative to `server/`.

| Area | Files |
| --- | --- |
| Configuration | `.env.example`, `src/app.ts`, `src/config/auth-cookie.ts`, `src/config/auth-session.ts` (new), `src/config/env.ts` |
| Validation and access | `src/middleware/auth.middleware.ts`, `src/middleware/workspace-membership.middleware.ts`, `src/middleware/object-id.middleware.ts` (new), `src/middleware/csrf.middleware.ts` (new), `src/errors/workspace.error.ts` |
| Users | `src/modules/user/user.schema.ts`, `src/modules/user/user.service.ts`, `src/modules/user/user.security.test.ts` (new) |
| Workspaces | `src/modules/workspace/workspace.routes.ts`, `src/modules/workspace/workspace.service.ts`, `src/modules/workspace/workspace.test.ts` |
| Issues | `src/modules/issue/issue.routes.ts`, `src/modules/issue/issue.service.ts` |
| Comments and dashboard | `src/modules/comment/comment.routes.ts`, `src/modules/dashboard/dashboard.routes.ts` |
| Transactions | `src/utils/transaction.ts` (new) |
| Tests | `src/modules/health/health.test.ts`, `src/test/setup.ts`, `src/test/resource-security.test.ts` (new), `src/test/security-config.test.ts` (new), `vitest.config.ts` |
| Documentation | `README.md`, `docs/api.md`, `docs/security-review.md` (this report, new) |

## Verification

Commands ran from `server/`.

| Check | Final result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm test` | Passed: 70 tests across eight files; 117.90 seconds |
| `npm run build` | Passed |
| `TEST_MONGODB_REPLICA_SET=1 npm test -- src/test/resource-security.test.ts` | Passed: 15 tests, including real transaction rollback; 15.32 seconds |
| Markdown parsing and source links | Passed: 25 headings, 12 tables, 16 fenced blocks; relative source links resolve |
| `git diff --check` | Passed |

The replica-set command above uses POSIX environment notation for brevity;
the [API testing section](api.md#testing) includes the PowerShell equivalent.
Both MongoDB runs used temporary isolated instances. No development or production
database was used. The test cleanup checks the isolated connection and database name.

No production browser deployment or GitHub-rendered visual inspection was performed.
Markdown was checked structurally with the installed parser. Frontend Axios
credentials and absence of token-storage writes were inspected in source; no
frontend UI or dependencies were changed.

## Security decisions and existing behavior

Cookies remain HttpOnly, host-only, named `trackflow_session`, and scoped to
`/api/v1`. Set/clear options match; production cookies are Secure. JWTs remain
absent from response bodies and browser storage. Logout still clears the browser
cookie without revoking a copied JWT. Existing role rules and comment ownership
404 responses remain intact, as does the restriction on reassigning done issues.

CORS permits credentials only for the exact configured frontend origin.
State-changing requests independently validate Origin; there is no CSRF-token
endpoint. This separates CORS response-access rules from CSRF checks, consistent
with [OWASP guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
CLI clients in None mode must send the configured Origin explicitly.

No endpoints were renamed, successful response shapes changed, environment secrets
edited, packages added, or commits/pushes made.

## Deployment decisions and limitations

- Set the real frontend `CLIENT_ORIGIN` and frontend `VITE_API_URL`. Production
  remains a placeholder in the API reference.
- Choose `COOKIE_SAME_SITE=lax` for HTTPS sibling subdomains or `none` for genuinely
  cross-site HTTPS hosting. Verify cross-site cookies in supported browsers;
  third-party cookie restrictions may still interfere.
- Select MongoDB topology. Replica sets/sharded deployments support atomic
  multi-document cascades; standalone instances cannot provide that guarantee.
  See [MongoDB transactions](https://www.mongodb.com/docs/v8.0/core/transactions/).
- Standalone failures may leave a partially completed deletion. Retry after fixing
  the failure; if memberships were deleted before workspace deletion failed,
  administrator recovery may be necessary.
- Existing creation routes do not coordinate concurrent child creation with
  deletion. Avoid concurrent writes during deletion. Transactions make the
  cascade's own operations atomic, but do not add foreign-key constraints.
- Readiness observes Mongoose's connection state; it does not ping MongoDB or
  guarantee the next query will succeed.

See the [API reference](api.md) for complete endpoint, filtering, pagination,
authentication, authorization, and deployment contracts.

