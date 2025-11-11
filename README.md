# DiscoverHealth Backend

Express-based API with SQLite (better-sqlite3) and static assets for DiscoverHealth.

## Purpose

DiscoverHealth helps users discover, review, and recommend healthcare resources (clinics, hospitals, services) by location and category. The backend provides secure APIs for:

- Managing healthcare resources and metadata
- User registration and authentication
- Posting and fetching reviews and recommendations
- Serving a simple frontend (in `public/`) and interactive API docs

## Prerequisites

- Node.js 18+ recommended

## Setup

```bash
npm install
npm run start
# Server runs on http://localhost:3000
```

## Scripts

- `start`: Run the server
- `dev`: Same as start (customize to use nodemon if desired)

## API

- Swagger docs at `/api-docs` when running locally.
- Routes:
  - `/resources`
  - `/users`
  - `/reviews`
  - `/auth`

## Database

Uses `better-sqlite3` with a local file `discoverhealth.db`. Tables are auto-created on startup.

Note: Local SQLite files are not suitable for serverless environments or ephemeral filesystems. For production deploys, use a hosted database (Postgres/MySQL/Turso/Vercel Postgres) and refactor DB access accordingly.

## Deployment Notes

This app is built as a long-running Express server that reads/writes a local SQLite file. Vercel's default Serverless/Edge runtimes are not compatible with:

- native addons like `better-sqlite3` in many cases, and
- persistent local files (the filesystem is ephemeral/read-only).

If you want to deploy to Vercel:

1. Migrate from SQLite to a hosted DB (e.g., Vercel Postgres, Neon, PlanetScale, Turso/libSQL).
2. Replace `better-sqlite3` with a library that connects to your hosted DB (e.g., `pg`, `mysql2`, `@libsql/client`, or an ORM like Prisma/Drizzle).
3. Either:
   - Convert endpoints into `api/*.js` Serverless functions, or
   - Use Vercel's Node Server (Build Output API v3 “server” output) with a single entry that exports a handler, still connecting to the hosted DB.

Alternative: Deploy the current Express server on a traditional host (Render, Railway, Fly.io, Docker on a VPS), where long-running processes and local storage are supported.

## Environment

Respects `PORT` from the environment; defaults to `3000`.
