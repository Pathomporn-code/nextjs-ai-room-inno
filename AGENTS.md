<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Developer Commands
- `npm run dev`: Start dev server.
- `npm run build`: Production build.
- `npm run lint`: Lint check.
- `npx prisma generate`: Generate Prisma client. **Required** before dev/build if schema changes.

# Architecture & Tech Stack
- **Framework**: Next.js 16.3.1 (App Router in `src/app`).
- **Database**: MariaDB via Prisma.
- **Auth**: `better-auth` (`src/lib/auth.ts` server, `src/lib/auth-client.ts` client).
- **State**: `zustand` for client-side state.

# Quirks & Constraints
- **Prisma Client**: Generated into `/generated/prisma` rather than `node_modules`.
- **MariaDB**: Uses `@prisma/adapter-mariadb` for the database connection in `src/lib/prisma.ts`.

