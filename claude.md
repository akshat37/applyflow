Build a complete, production-ready full-stack web application called "Applyflow". Every file must be fully generated — no placeholders, no TODOs, no truncated code. The app must run immediately after `npm install` with zero manual configuration and zero external services.

---

## Constraints

- No authentication, no OAuth, no Firebase, no Supabase, no Clerk, no cloud database
- SQLite only — all data stays local on disk
- npm only (no pnpm, no yarn)
- Node.js 18+
- Strict TypeScript everywhere — no `any`
- No TODOs, FIXMEs, or placeholder comments anywhere

---

## Tech Stack

**Frontend:** React 18, Vite, TypeScript, Tailwind CSS v3, Radix UI (Dialog + Select + Label), TanStack React Query v5, Axios, Lucide React, Sonner (toasts), date-fns, clsx, tailwind-merge

**Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite, Zod, cors, tsx (for running TS directly)

**Package manager:** npm workspaces — one root `package.json` managing both `client/` and `server/` workspaces

---

## Project Structure

```
applyflow/
├── client/
│   └── src/
│       ├── components/
│       │   ├── ui/          ← reusable primitives: Button, Badge, Input, Select, Textarea, Modal
│       │   ├── JobModal.tsx
│       │   ├── JobTable.tsx
│       │   ├── StatCard.tsx
│       │   ├── FilterBar.tsx
│       │   └── RecentActivity.tsx
│       ├── pages/
│       │   ├── Landing.tsx
│       │   └── Dashboard.tsx
│       ├── hooks/useJobs.ts
│       ├── lib/api.ts
│       ├── lib/utils.ts
│       └── types/index.ts
├── server/
│   └── src/
│       ├── routes/jobs.ts
│       ├── controllers/jobController.ts
│       ├── middleware/errorHandler.ts
│       ├── lib/prisma.ts
│       └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── README.md
```

---

## Database Schema

Use Prisma with SQLite. The single model is `Job` with these fields:

- `id` — cuid, primary key
- `companyName` — String, required
- `role` — String, required
- `jobUrl` — String, optional
- `locationType` — String, default "Remote"
- `locationName` — String, optional
- `jobType` — String, default "Full-Time"
- `status` — String, default "Applied"
- `appliedDate` — DateTime, optional (nullable — do NOT use a default value here)
- `notes` — String, optional
- `createdAt` — DateTime, default now
- `updatedAt` — DateTime, auto-updated

Important: SQLite does not support Prisma enums. Use String fields for locationType, jobType, and status — enforce valid values with Zod on the server side only.

The SQLite database file must be written to `server/prisma/database/dev.db`. Create that directory. Add `server/prisma/database/` and all `*.db` files to `.gitignore`.

---

## Valid Values (enforced by Zod, not Prisma enums)

**LocationType:** Remote, Hybrid, On-site

**JobType:** Internship, Full-Time, Part-Time, Contract

**ApplicationStatus:** Bookmarked, Applied, Interview Scheduled, Assessment, HR Round, Technical Round, Final Round, Offer Received, Accepted, Rejected, No Response, Withdrawn

---

## Root package.json — Critical Scripts

The root `package.json` must use npm workspaces pointing to `["client", "server"]` and include these scripts:

- `dev` — runs both frontend and backend concurrently
- `client` — runs the Vite dev server (port 5173) via the client workspace
- `server` — runs the Express server (port 3001) via the server workspace
- `db:migrate` — runs `prisma migrate dev --name init` inside the server directory
- `db:seed` — runs the seed file via tsx
- `postinstall` — runs `prisma generate` inside the server directory automatically after `npm install`

The `postinstall` script is critical. Without it, Prisma Client won't exist after a fresh install and the server will crash with a module-not-found error.

---

## API Endpoints

All routes are under `/api/jobs`. All responses use consistent JSON.

- `GET /api/jobs` — returns `{ data: Job[], stats: DashboardStats }`. Supports query params: `search` (matches companyName, role, locationName case-insensitively), `status`, `jobType`, `locationType`, `sortBy` (newest / oldest / company / appliedDate). Stats are computed server-side from the filtered result set.
- `GET /api/jobs/:id` — returns `{ data: Job }`
- `POST /api/jobs` — validates body with Zod, returns `{ data: Job }` with status 201
- `PUT /api/jobs/:id` — validates body with Zod, returns `{ data: Job }`
- `DELETE /api/jobs/:id` — returns `{ message: string }`
- `POST /api/jobs/seed` — seeds the database with the 15 sample jobs (used by the Landing page "View Demo Data" button)

DashboardStats shape: `{ total, applied, bookmarked, interviews, rejected, offers, noResponse }` — each is a count derived from the filtered job list.

---

## Vite Proxy

Configure Vite to proxy all `/api` requests to `http://localhost:3001`. This eliminates CORS issues in development. The frontend should make all API calls to `/api/...` without any hardcoded hostname.

---

## CORS

Configure the Express server with `cors({ origin: 'http://localhost:5173', credentials: true })`.

---

## Error Handling

**Server:** Every async route handler must use try/catch and pass errors to `next(err)`. The global error middleware must handle: Prisma P2025 (not found) → 404, Zod validation errors → 400 with details, everything else → 500. Always return `{ error: string, details?: unknown }`.

**Client:** React Query mutation errors must show a Sonner toast. Network-level errors must show a dismissible banner on the Dashboard. The table empty state must distinguish between "no jobs added yet" and "no results match the current filters".

---

## Frontend State

- All server state via React Query. Do not use Redux, Zustand, or Context API.
- Local UI state (useState only): modal open/closed, which job is being edited, current filter values, delete confirmation id.
- After every mutation (create, update, delete), invalidate the jobs query so the table and stat cards refresh automatically.
- Debounce the search input by 300ms before triggering a query.

---

## Component Behaviour

**JobModal:** Renders as a Radix UI Dialog. Supports two modes — Add (empty) and Edit (pre-filled). Company and Role are required; show inline field-level error messages (not alert dialogs). Validate URL format on blur. On success, close modal and show a success toast.

**JobTable:** Columns: Company, Role, Status (badge), Job Type (badge), Location, Applied Date, Actions. Actions: Edit (pencil icon), Delete (trash icon — requires confirmation before calling the API), Open Link (external-link icon, disabled if no jobUrl). Show a helpful empty state when there are no rows.

**FilterBar:** Search input, Status dropdown, Job Type dropdown, Location Type dropdown, Sort dropdown, and a "Clear filters" button that is only visible when at least one filter is active.

**StatCard:** Shows an icon, a large number, and a label. The 7 cards are: Total Applications, Applied, Bookmarked, Interviews, Rejected, Offers, No Response.

**RecentActivity:** Last 10 jobs sorted by `updatedAt` descending. Each row shows company, role, status badge, and a relative time string (e.g. "3 hours ago"). Clicking a row opens the edit modal.

---

## Dashboard Layout

Top row: 7 stat cards (wrap on smaller screens, 2-per-row on mobile).
Middle row: FilterBar spanning full width.
Bottom row: JobTable (roughly 2/3 width) + RecentActivity panel (1/3 width) side by side on desktop, stacked vertically on mobile.
Header: app title on the left, "Add Job" button on the right.

---

## Landing Page

Full-viewport hero section with:
- Heading: "Applyflow" as the brand name/logo, with tagline "Your Job Search, Organised." below it
- Subheading: "Track every application, interview, and offer in one clean dashboard — no spreadsheets needed."
- Two buttons: "Start Tracking" (navigates to /dashboard) and "View Demo Data" (calls POST /api/jobs/seed then navigates to /dashboard)
- A simple visual using Lucide icons that suggests the application pipeline (e.g. a row of status stages)
- No login, no navbar, just the hero

---

## Visual Design

- Page background: gray-50. Card backgrounds: white.
- Primary accent: blue-600 for buttons, links, focus rings.
- Borders: gray-200. Dividers: gray-100.
- Cards: rounded-xl, shadow-sm, border border-gray-200.
- Status badge colours by family:
  - Bookmarked, No Response, Withdrawn → gray
  - Applied → blue
  - Interview Scheduled, Assessment, HR Round, Technical Round, Final Round → yellow/amber
  - Offer Received, Accepted → green
  - Rejected → red
- Fully responsive — usable at 375px mobile width. Table scrolls horizontally on small screens.

---

## Seed Data

Generate 15 realistic job applications in `prisma/seed.ts`. Cover all status types. Use a realistic mix of companies (large tech, startups, mid-size product companies), roles (Software Engineer, ML Engineer, Data Analyst, Frontend Engineer, Product Manager, etc.), location types, and job types. Spread `appliedDate` values across the past 90 days. Include brief realistic notes on some entries. Use `prisma.job.createMany()`. Handle errors with try/catch and always call `prisma.$disconnect()` in a finally block.

---

## README

Include these sections: Project Overview, Features list, Tech Stack, Prerequisites (Node 18+, npm 9+), Installation steps (exact commands in order), All npm scripts explained, API endpoints table, Folder structure with annotations, Future improvements (auth, email reminders, calendar integration, resume storage, cloud sync, analytics).

The installation steps must be exactly:
1. Clone the repo
2. `npm install` (also generates Prisma client automatically)
3. `npm run db:migrate`
4. `npm run db:seed` (optional)
5. `npm run dev`

---

## Final Checks Before Finishing

Verify these are all true before considering the implementation complete:

- `npm install` completes without errors and Prisma Client is generated automatically
- `npm run db:migrate` creates the SQLite file at `server/prisma/database/dev.db`
- `npm run dev` starts both servers with no port conflicts
- The GET /api/jobs endpoint returns the correct JSON shape including stats
- All 7 stat cards recalculate after every add, edit, or delete
- Search debouncing prevents API calls on every keystroke
- Filters combine — selecting both a status and a job type narrows results correctly
- Delete always requires confirmation
- The "View Demo Data" button on the landing page works end-to-end
- No TypeScript errors across the entire codebase
- The app is usable on a 375px mobile screen