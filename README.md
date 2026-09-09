# TrackFlow

TrackFlow is a full-stack MERN issue-tracking application that helps teams manage workspaces, members, issues, assignments, priorities, statuses, and comments.

The project is being developed backend-first. The React client will be added after the backend API is complete.

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Zod
- JWT
- bcrypt
- Vitest
- Supertest

### Frontend

- React
- TypeScript

Additional frontend tools will be documented when client development begins.

## Planned Features

- User authentication
- Workspaces and team members
- Role-based authorization
- Issue management
- Issue assignment, priority, and status
- Comments
- Search, filtering, and pagination
- Dashboard statistics
- API testing
- Deployment

## Project Structure

```text
trackflow/
├── server/     # Express backend API
└── client/     # React frontend (coming later)
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/trackflow.git
cd trackflow/server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Start the development server:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

## Health Check

```http
GET /api/v1/health
```

## Available Backend Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run format
```

## Project Status

🚧 In development — the backend API is currently being built. Client development will begin after the backend is complete.

## Author

Goodness Nwachukwu
