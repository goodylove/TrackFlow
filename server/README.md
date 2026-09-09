# TrackFlow server

Express and MongoDB API for TrackFlow.

See the [API reference](docs/api.md) for all endpoints, cookie authentication,
permissions, request bodies, response shapes, and a PowerShell quick start.

## Run locally

From `server/`, install dependencies with `npm ci`. Create or update `.env` with
the values below, using your own JWT secret and MongoDB connection string:

```dotenv
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/trackflow
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
COOKIE_SAME_SITE=lax
```

Start MongoDB, then run `npm run dev`. The server connects to MongoDB before
listening. The default API base URL is `http://localhost:5000/api/v1`.

For the Vite client, `VITE_API_URL` defaults to that API base URL. Set
`CLIENT_ORIGIN` to the frontend's exact origin, including its port.
See [environments](docs/api.md#environments) and [CORS and CSRF](docs/api.md#cors-and-csrf)
before configuring production domains or cross-site cookies.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with file watching |
| `npm run typecheck` | Check TypeScript without emitting files |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest suite |
| `npm run build` | Compile the server into `dist/` |
| `npm start` | Run the compiled server |
