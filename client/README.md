# TrackFlow Client

TrackFlow is a responsive issue-tracking application for focused teams. This
directory contains the React client: the public marketing experience,
authentication flows, workspace management, dashboard reporting, and the
Kanban-style issue workflow.

The client is designed to work with the TrackFlow Express API in the sibling
[`server`](../server) directory.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Application routes](#application-routes)
- [API integration](#api-integration)
- [State and data flow](#state-and-data-flow)
- [Design system and accessibility](#design-system-and-accessibility)
- [Development conventions](#development-conventions)
- [Quality checks](#quality-checks)
- [Deployment](#deployment)
- [Current scope](#current-scope)

## Features

### Public experience

- Responsive TrackFlow landing page with product-focused sections.
- Mobile navigation and anchor links to the relevant marketing sections.
- Search-engine metadata managed per route.
- Clear paths from the landing page to registration and sign-in.

The product previews on the marketing page are illustrative. Authenticated
workspace data is loaded only inside the application dashboard.

### Authentication

- Account registration and login through the TrackFlow API.
- Zod validation with accessible field-level and form-level messages.
- Protected dashboard routes and public-only login/register routes.
- Optional persistent sessions through the login form's remember setting.
- Automatic logout and client-state cleanup when the API returns `401`.
- Safe relative redirects back to the requested authenticated route.

### Workspaces and members

- Create, list, select, inspect, and delete workspaces.
- Persist the selected workspace between browser sessions.
- Display workspace member count, open issue count, and creation time.
- Add members, change supported member roles, and remove members.
- Role-aware controls for destructive workspace and issue actions.

### Dashboard

- Workspace statistics loaded from the dashboard statistics endpoint.
- Total, assigned, unassigned, and overdue issue metrics.
- Six-month issue creation trend.
- Priority distribution generated from authoritative server counts.
- Recent issue table with search, status filtering, and priority filtering.
- A focused list of issues assigned to the signed-in user.
- Dedicated loading, empty, error, and retry states.

### Issues

- Kanban board organized into **Todo**, **In Progress**, and **Done**.
- Create, edit, assign, move, and delete workspace issues.
- Drag-and-drop status changes; priority remains a separate issue property.
- Keyboard status movement with the left and right arrow keys.
- Search and filters for status, priority, and assignee.
- Three recent issues shown per column by default, with load-more controls.
- Issue cards display the identifier, title, description, priority, assignee,
  creation date, due-date state, and comment count.
- Responsive horizontal board scrolling on smaller screens.

### Comments

- Paginated comment history for each issue.
- Add new comments with validation and immediate cache updates.
- Edit or delete only comments authored by the signed-in user.
- Confirmation before permanent comment deletion.
- Issue comment counts stay synchronized after creation and deletion.

## Technology

| Area | Technology |
| --- | --- |
| UI framework | React 19 and TypeScript |
| Build tooling | Vite 8 |
| Routing | React Router 7 |
| Server state | TanStack Query 5 |
| Local state | Zustand 5 |
| HTTP client | Axios |
| Forms | React Hook Form and Zod |
| Styling | Tailwind CSS 4 and CSS variables |
| UI primitives | shadcn/ui-style components backed by Base UI |
| Icons | Phosphor Icons |
| Charts | Recharts |
| Motion | Framer Motion |
| Notifications | Sonner |
| Metadata | React Helmet |

## Project structure

```text
client/
├── public/                     # Public assets copied as-is by Vite
├── src/
│   ├── assets/                 # Images and bundled Satoshi font files
│   ├── components/
│   │   ├── layout/             # Authenticated shell, sidebar, and header
│   │   ├── marketing/          # Landing-page sections and previews
│   │   ├── shared/             # Shared container, branding, and SEO helpers
│   │   └── ui/                 # Reusable UI primitives
│   ├── config/                 # Validated client environment configuration
│   ├── feature/
│   │   ├── auth/               # Authentication forms, schemas, and requests
│   │   ├── dashboard/          # Dashboard UI, types, and API services
│   │   ├── issues/             # Kanban board, issue forms, and comments
│   │   └── workspace/          # Workspace member and settings features
│   ├── lib/
│   │   ├── api/                # Axios clients and normalized API errors
│   │   └── query/              # Shared TanStack Query configuration
│   ├── pages/                  # Route-level page components
│   ├── stores/                 # Authentication, workspace, and UI stores
│   ├── styles/                 # Tailwind entrypoint and design tokens
│   ├── App.tsx                 # Lazy route definitions and route guards
│   └── main.tsx                # Client providers and application bootstrap
├── components.json             # shadcn/ui configuration
├── vite.config.ts              # Vite plugins and the @ source alias
└── package.json
```

Feature-specific API calls, schemas, types, and UI are kept together. Shared
layout and primitive components remain outside feature folders so that they can
be reused without coupling unrelated features.

## Getting started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`, as required by the installed Vite version.
- npm.
- A running TrackFlow API and MongoDB instance. See the sibling
  [`server`](../server) project for backend setup.

### Install dependencies

From the repository root:

```bash
cd client
npm install
```

### Configure the API

Create `client/.env.local` and set the API base URL:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_API_TIMEOUT_MS=15000
```

Both variables are optional during local development because these values are
also the client defaults.

### Run the application

Start the API in one terminal:

```bash
cd server
npm install
npm run dev
```

Start the client in another terminal:

```bash
cd client
npm run dev
```

Vite normally serves the application at `http://localhost:5173`.

## Environment variables

Only variables prefixed with `VITE_` are exposed to browser code.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_API_URL` | No | `http://localhost:5000/api/v1` | Base URL for public and authenticated API requests. Must use HTTP or HTTPS. |
| `VITE_API_TIMEOUT_MS` | No | `15000` | Request timeout in milliseconds. Accepted range: `1000` to `60000`. |

Invalid values fail during application startup instead of silently using a
broken API configuration.

Do not place secrets in client environment files. Values bundled by Vite are
readable by anyone who downloads the application.

## Available scripts

Run these commands from `client/`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run build` | Type-check the project and create the production bundle in `dist/`. |
| `npm run lint` | Run ESLint across the client project. |
| `npm run preview` | Serve the production bundle locally for a final smoke test. |

For a focused application type-check while investigating unrelated unused
declarations, run:

```bash
npx tsc -p tsconfig.app.json --noEmit --pretty false \
  --noUnusedLocals false --noUnusedParameters false
```

## Application routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | TrackFlow marketing page. |
| `/login` | Signed-out users | Login form. Authenticated users are redirected to the dashboard. |
| `/signup` | Signed-out users | Registration form. Authenticated users are redirected to the dashboard. |
| `/dashboard` | Authenticated | Selected-workspace dashboard and issue metrics. |
| `/dashboard/issues` | Authenticated | Kanban issue management. |
| `/dashboard/members` | Authenticated | Workspace membership management. |
| `/dashboard/settings` | Authenticated | Selected-workspace details and destructive settings. |
| `/dashboard/workspace` | Authenticated | Workspace list and selection. |

Unknown routes redirect to `/`. Dashboard pages are lazy-loaded beneath a
shared authenticated layout.

## API integration

The client expects the API response envelope:

```ts
type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[] | undefined>
}
```

Requests are made relative to `VITE_API_URL`.

### Authentication endpoints

| Method | Endpoint | Client usage |
| --- | --- | --- |
| `POST` | `/users/register` | Create an account. |
| `POST` | `/users/login` | Authenticate and receive the bearer token and user. |

### Workspace endpoints

| Method | Endpoint | Client usage |
| --- | --- | --- |
| `GET` | `/workspaces` | Load workspaces available to the signed-in user. |
| `POST` | `/workspaces` | Create a workspace. |
| `GET` | `/workspaces/:workspaceId` | Load selected-workspace details. |
| `DELETE` | `/workspaces/:workspaceId` | Permanently delete an authorized workspace. |
| `GET` | `/workspaces/:workspaceId/members` | List workspace memberships. |
| `POST` | `/workspaces/:workspaceId/members` | Add a workspace member. |
| `PATCH` | `/workspaces/:workspaceId/members/:memberId/role` | Change a supported member role. |
| `DELETE` | `/workspaces/:workspaceId/members/:memberId` | Remove a member. |

### Dashboard and issue endpoints

| Method | Endpoint | Client usage |
| --- | --- | --- |
| `GET` | `/workspaces/:workspaceId/dashboard/stats` | Load total, assignment, overdue, status, and priority counts. |
| `GET` | `/workspaces/:workspaceId/issues` | Load workspace issues for the board and dashboard activity. |
| `POST` | `/workspaces/:workspaceId/issues` | Create an issue. |
| `PATCH` | `/workspaces/:workspaceId/issues/:issueId` | Update status or editable issue details. |
| `PATCH` | `/workspaces/:workspaceId/issues/:issueId/assignee` | Assign or unassign an issue. |
| `DELETE` | `/workspaces/:workspaceId/issues/:issueId` | Delete an issue when the member role permits it. |

### Comment endpoints

| Method | Endpoint | Client usage |
| --- | --- | --- |
| `GET` | `/workspaces/:workspaceId/issues/:issueId/comments` | Load paginated comments. |
| `POST` | `/workspaces/:workspaceId/issues/:issueId/comments` | Add a comment. |
| `PATCH` | `/workspaces/:workspaceId/issues/:issueId/comments/:commentId` | Edit the signed-in user's comment. |
| `DELETE` | `/workspaces/:workspaceId/issues/:issueId/comments/:commentId` | Delete the signed-in user's comment. |

The authenticated Axios client adds the bearer token automatically. The public
Axios client is used for login and registration so stale tokens are never sent
to authentication endpoints.

## State and data flow

### Server state

TanStack Query owns API-backed data such as workspaces, members, dashboard
statistics, issues, and comments.

- Query keys include the workspace ID to isolate cached workspace data.
- Successful mutations update or invalidate the relevant cache entries.
- Queries remain fresh for one minute and unused entries are collected after
  five minutes.
- Failed queries retry at most twice, and only network-like failures, `408`,
  `429`, and `5xx` responses are considered retryable.
- Queries refetch after reconnecting or returning focus to the window.
- Mutations do not retry automatically.

### Client state

Zustand is intentionally limited to client-owned state:

- `auth-store.ts` holds the active token and authenticated user.
- `workspace-store.ts` persists only the selected workspace ID.
- Workspace records and feature data stay in the TanStack Query cache.

Selecting another workspace changes the relevant query keys and causes the
dashboard, issues, members, and settings views to load the correct data.

### Authentication persistence

When **Remember me** is enabled, the session is stored in `localStorage`.
Otherwise it is stored in `sessionStorage`. Logging out or receiving a `401`
clears authentication, the selected workspace, and all cached server data.

## Design system and accessibility

- Satoshi is the main interface typeface; JetBrains Mono is available for
  identifiers and other technical text.
- Global colors, radii, and spacing-related theme values live in
  `src/styles/variables.css`.
- Reusable controls live in `src/components/ui` and follow the configured
  shadcn `base-lyra` style.
- Phosphor Icons are used consistently for interface actions and status cues.
- Controls provide readable labels instead of relying only on icon shape or
  color.
- Focus-visible rings are included for keyboard navigation.
- Form fields connect labels, descriptions, validation messages, and
  `aria-invalid` state.
- Loading and mutation states use status text and disable conflicting actions.
- Destructive actions use explicit confirmation modals.
- The dashboard shell, forms, tables, and Kanban board adapt to mobile, tablet,
  and desktop layouts.

The bundled Satoshi font files and their upstream documentation live under
`src/assets/fonts/satoshi`.

## Development conventions

### Imports

Use the `@` alias for files under `src`:

```ts
import { Button } from "@/components/ui/button"
```

### Adding API behavior

1. Define the API response shape close to the feature service.
2. Perform the request through `publicApiClient` or `apiClient`.
3. Validate the response envelope before returning data.
4. Convert transport objects into stable UI-facing types when needed.
5. Normalize request failures with `toApiError`.
6. Expose the operation through a TanStack Query hook.
7. Update or invalidate every affected cache key after mutations.
8. Keep loading, empty, error, success, and permission states explicit in the
   consuming component.

### Adding forms

- Put reusable validation in a feature-level Zod schema.
- Connect the schema with `zodResolver` and React Hook Form.
- Use the shared `Form` components for accessible labels and messages.
- Map server field errors back to their relevant controls.
- Keep unexpected failures visible without discarding entered form data.

### Component boundaries

- Route composition belongs in `src/pages`.
- Domain behavior belongs in the matching `src/feature` directory.
- Generic primitives belong in `src/components/ui`.
- Shared application layout belongs in `src/components/layout`.
- Avoid storing API records in Zustand when TanStack Query already owns them.

## Quality checks

Before opening a pull request or preparing a demo:

```bash
npm run lint
npm run build
```

There is currently no dedicated automated client test script. Important flows
should therefore receive a focused manual pass:

1. Register, sign in, refresh the page, and sign out.
2. Create and switch between workspaces.
3. Add a member and verify role-aware controls.
4. Create, edit, assign, move, filter, and delete an issue.
5. Add, edit, paginate, and delete issue comments.
6. Confirm dashboard counts update after returning from issue management.
7. Check keyboard focus and board status movement.
8. Check the landing page and dashboard at mobile, tablet, and desktop widths.
9. Test loading, empty, validation, API failure, and retry states.

## Deployment

Create the production bundle with:

```bash
npm run build
```

Vite writes the deployable assets to `client/dist`. Set `VITE_API_URL` to the
production API URL before building because Vite environment values are embedded
at build time.

The hosting platform must serve `index.html` for unknown application paths so
that direct visits to routes such as `/dashboard/issues` are handled by React
Router. The API must also allow requests from the deployed client origin.

Preview the final bundle locally with:

```bash
npm run preview
```

## Current scope

- The dashboard and board request up to 100 workspace issues per load. Server
  statistics remain authoritative for totals and distributions.
- Short `TF-xxxxx` issue identifiers are currently derived in the client from
  the canonical database ID.
- Dashboard issue activity is read-only; issue mutations live on the Issues
  page.
- Updates are request-driven rather than real-time; WebSocket collaboration is
  not implemented.
- File attachments and notification-center workflows are not implemented.
- The client currently persists bearer tokens in browser storage. A production
  security hardening pass may move authentication to secure, HTTP-only cookies.

## Repository

The complete TrackFlow project is available at
[github.com/goodylove/TrackFlow](https://github.com/goodylove/TrackFlow).
