# Applyflow

Track every job application, interview, and offer in one clean dashboard — no spreadsheets needed.

## Features

- Add, edit, and delete job applications
- 12 application statuses (Bookmarked → Accepted / Rejected)
- Dashboard stats (total, applied, bookmarked, interviews, rejected, offers, no response)
- Filter by status, job type, and location type
- Full-text search across company, role, and location
- Sort by newest, oldest, company, or applied date
- Recent activity panel with relative timestamps
- Demo data seeding from the landing page
- Fully responsive (works on 375px mobile screens)
- All data stored locally in SQLite — no cloud, no auth

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS v3, Radix UI, TanStack React Query v5, Axios, Lucide React, Sonner, date-fns
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite, Zod
- **Package manager:** npm workspaces

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd applyflow

# 2. Install dependencies (also auto-generates Prisma Client)
npm install

# 3. Create the database and run migrations
npm run db:migrate

# 4. (Optional) Seed with demo data
npm run db:seed

# 5. Start both servers
npm run dev
```

The app will be available at http://localhost:5173

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Runs both frontend (port 5173) and backend (port 3001) concurrently |
| `npm run client` | Runs only the Vite dev server |
| `npm run server` | Runs only the Express server |
| `npm run db:migrate` | Creates the SQLite database and applies migrations |
| `npm run db:seed` | Seeds the database with 15 realistic sample jobs |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/jobs` | List jobs with filters + stats |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create a job |
| PUT | `/api/jobs/:id` | Update a job |
| DELETE | `/api/jobs/:id` | Delete a job |
| POST | `/api/jobs/seed` | Seed demo data |

### Query params for GET /api/jobs

`search`, `status`, `jobType`, `locationType`, `sortBy` (newest / oldest / company / appliedDate)

## Folder Structure

```
applyflow/
├── client/                   # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── ui/           # Reusable primitives (Button, Badge, Input, Select, Textarea, Modal)
│       │   ├── JobModal.tsx  # Add/edit dialog
│       │   ├── JobTable.tsx  # Applications table with inline delete confirmation
│       │   ├── StatCard.tsx  # Dashboard stat tile
│       │   ├── FilterBar.tsx # Search + filter controls
│       │   └── RecentActivity.tsx
│       ├── pages/
│       │   ├── Landing.tsx   # Hero page with "Start Tracking" and "View Demo Data"
│       │   └── Dashboard.tsx # Main application view
│       ├── hooks/useJobs.ts  # React Query hooks (useJobs, useCreateJob, …)
│       ├── lib/api.ts        # Axios API client
│       ├── lib/utils.ts      # cn() helper + status colour mapping
│       └── types/index.ts    # Shared TypeScript types
├── server/                   # Express + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma schema (SQLite)
│   │   ├── seed.ts           # 15 demo jobs
│   │   └── database/         # SQLite database lives here (gitignored)
│   └── src/
│       ├── controllers/jobController.ts
│       ├── routes/jobs.ts
│       ├── middleware/errorHandler.ts
│       ├── lib/prisma.ts
│       └── index.ts
└── package.json              # Root workspace
```

## Future Improvements

- Authentication (email/password or OAuth)
- Email reminders for follow-ups
- Calendar integration (sync interview dates)
- Resume / cover letter storage per application
- Cloud sync across devices
- Analytics (funnel charts, response rate over time)
