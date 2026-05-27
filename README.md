# Guidepost

A college application platform for students and parents. Students manage tasks, write essays, and get AI-powered feedback. Parents track financial aid, compare college costs, and monitor student progress.

AI features are powered by [NVIDIA NIM](https://integrate.api.nvidia.com) (OpenAI-compatible API).

---

## Features

**Students**
- Task management across categories (essays, testing, extracurriculars, applications)
- Essay editor with version history and word-count tracking
- AI essay feedback — narrative clarity, prompt alignment, revision suggestions
- Progress dashboard with overdue alerts and upcoming deadlines
- Grade-by-grade application timeline

**Parents**
- Financial aid task tracking (FAFSA, CSS Profile, scholarships)
- College budget planner — compare net costs across schools
- AI analysis of financial aid documents and award letters
- Linked student progress view

**Both**
- Role-based accounts (Student, Parent, Admin)
- Parent accounts link to a student account at registration
- Public explore pages with sample data — no account required to preview

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (httpOnly cookies, 7-day expiry) + bcryptjs |
| AI | NVIDIA NIM — `nvidia/llama-3.1-nemotron-70b-instruct` |
| Cache | In-memory (rate limiting) |
| Validation | Zod |

---

## Prerequisites

- **Node.js** 20 or later
- **Docker** (for Postgres) — or provide your own instance
- **NVIDIA NIM API key** — required for AI features ([get one](https://integrate.api.nvidia.com))

---

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd guidepost
npm install
```

### 2. Start infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432`.

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` — at minimum set `NVIDIA_NIM_API_KEY` to enable AI features. All other values have working local defaults.

### 4. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Apply the schema
npm run db:migrate

# Seed demo data
npm run db:seed
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values below.

### Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |

### Required for AI features

| Variable | Description | Default |
|---|---|---|
| `NVIDIA_NIM_API_KEY` | Your NVIDIA NIM API key (`nvapi-…`) | — |
| `NVIDIA_NIM_BASE_URL` | NIM API base URL | `https://integrate.api.nvidia.com/v1` |
| `NVIDIA_NIM_MODEL` | Model to use | `nvidia/llama-3.1-nemotron-70b-instruct` |

### Optional

| Variable | Description | Default |
|---|---|---|
| `JWT_SECRET` | Secret for signing auth tokens | `fallback-secret-change-in-production` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `RATE_LIMIT_MAX_REQUESTS` | General API rate limit per window | `100` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `60000` |

> **Production note:** Always set a strong, random `JWT_SECRET` before deploying. The default value is insecure.

### Full `.env` example

```env
# Database
DATABASE_URL="postgresql://college:college@localhost:5432/college?schema=public"

# Auth
JWT_SECRET="change-me-to-a-long-random-string"
JWT_EXPIRES_IN="7d"

# NVIDIA NIM
NVIDIA_NIM_API_KEY="nvapi-xxxxxxxxxxxxxxxxxxxx"
NVIDIA_NIM_BASE_URL="https://integrate.api.nvidia.com/v1"
NVIDIA_NIM_MODEL="nvidia/llama-3.1-nemotron-70b-instruct"
```

---

## Database

### Scripts

| Command | Description |
|---|---|
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:migrate` | Create and apply a migration (dev) |
| `npm run db:push` | Push schema directly without creating a migration |
| `npm run db:seed` | Seed demo data (clears existing data first) |
| `npm run db:studio` | Open Prisma Studio at `localhost:5555` |

### Creating a migration

After editing `prisma/schema.prisma`:

```bash
npm run db:migrate -- --name describe-your-change
```

### Demo accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Student | `student1@example.com` | `password123` |
| Student | `student2@example.com` | `password123` |
| Parent | `parent1@example.com` | `password123` |
| Admin | `admin@example.com` | `password123` |

`parent1` is linked to `student1`. The parent dashboard will show student1's progress and essays.

---

## Available Scripts

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:generate  # Regenerate Prisma client
npm run db:migrate   # Run Prisma migrations
npm run db:push      # Push schema without migration history
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
```

---

## Project Structure

```
guidepost/
├── prisma/
│   ├── schema.prisma        # Database schema (User, Task, Essay, Budget, …)
│   ├── seed.ts              # Demo data seeder
│   └── migrations/          # Migration history
│
├── src/
│   ├── app/                 # Next.js App Router pages and API routes
│   │   ├── api/
│   │   │   ├── auth/        # login, register, logout, me
│   │   │   ├── students/    # tasks (CRUD), essays (CRUD), progress
│   │   │   ├── parents/     # tasks (CRUD), budgets (CRUD), student-progress
│   │   │   ├── ai/          # essay-feedback, financial-aid-summary
│   │   │   └── admin/       # user listing and deletion
│   │   ├── auth/            # Login and register pages
│   │   ├── student/         # Dashboard, tasks, essays, timeline
│   │   ├── parent/          # Dashboard, financial aid, budgets, student progress
│   │   ├── explore/         # Public preview pages (no login required)
│   │   └── admin/           # Admin dashboard
│   │
│   ├── components/
│   │   ├── ui/              # Button, Card, Input, Select, Textarea,
│   │   │                    #   Spinner, Modal, Toast
│   │   └── layout/          # Sidebar (dark, with nav + user), Header
│   │
│   └── lib/
│       ├── ai/
│       │   ├── nvidia-nim.ts   # NVIDIA NIM API client
│       │   ├── prompts.ts      # System prompts for essay + financial aid
│       │   └── guardrails.ts   # Input validation and PII detection
│       ├── auth.ts             # JWT generation, password hashing, cookie helpers
│       ├── prisma.ts           # Prisma client singleton
│       ├── cache.ts            # In-memory cache (rate limiting)
│       ├── ratelimit.ts        # Rate limiters (general: 100/min, AI: 10/min)
│       ├── middleware.ts        # Route protection (auth + role checks)
│       ├── types/              # TypeScript interfaces
│       └── utils/
│           ├── validators.ts   # Zod schemas for all API inputs
│           ├── formatters.ts   # Date, currency, word count helpers
│           └── dates.ts        # Overdue / upcoming deadline helpers
│
├── docker-compose.yaml      # PostgreSQL for local dev
├── .env.example             # Environment variable template
├── tailwind.config.js       # Indigo/violet color palette, custom shadows
└── tsconfig.json
```

---

## User Roles

| Role | Access |
|---|---|
| **Student** | Own tasks (CRUD), own essays (CRUD), AI essay feedback, timeline |
| **Parent** | Own tasks (CRUD), own budgets (CRUD), AI financial aid analysis, linked student's read-only progress |
| **Admin** | List and delete any user account |

### Linking a parent to a student

When a parent registers, they enter their student's email address. This links the accounts — the parent's Student Progress page shows the student's tasks and essays. One student can have at most one linked parent.

---

## AI Features

Both AI endpoints require `NVIDIA_NIM_API_KEY` to be set. If the key is missing, the endpoint returns `503`.

### Essay Feedback — `POST /api/ai/essay-feedback`

- **Role:** Student only
- **Rate limit:** 10 requests per minute per user
- **Request body:** `{ essayId: string, content: string, prompt: string }`
- **Response:** Structured JSON with:
  - `narrativeClarity` — score (1–10) + comments
  - `promptAlignment` — score (1–10) + comments
  - `specificityVsGenerality` — score (1–10) + comments
  - `revisionSuggestions` — array of actionable suggestions
  - `overallAssessment` — summary paragraph
- **Side effects:** Creates an `EssayFeedback` record and an `AIInteraction` audit record

### Financial Aid Summary — `POST /api/ai/financial-aid-summary`

- **Role:** Parent only
- **Rate limit:** 10 requests per minute per user
- **Request body:** `{ documentType: 'fafsa' | 'award-letter' | 'scholarship', content: string }`
- **Response:** Structured JSON with:
  - `keyPoints` — most important facts
  - `importantDeadlines` — deadline strings extracted from the document
  - `actionItems` — steps the family needs to take
  - `financialBreakdown` — `{ totalAid, grants, loans, workStudy }` (null when amounts aren't present)
- **Side effects:** Creates an `AIInteraction` audit record

Both endpoints run PII pattern detection (SSN, credit card numbers, phone numbers) before sending content to the API.

---

## Docker Compose

`docker-compose.yaml` runs the local development infrastructure. The Next.js app itself runs with `npm run dev`.

```bash
# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down

# Stop and delete all data volumes
docker compose down -v
```

| Service | Image | Port | Container |
|---|---|---|---|
| PostgreSQL | `postgres:16-alpine` | `5432` | `guidepost-postgres` |

The default PostgreSQL credentials match the `DATABASE_URL` in `.env.example` (`college` / `college` / `college`).

---

## Route Protection

`src/lib/middleware.ts` enforces auth and role checks on every request:

| Path prefix | Requirement |
|---|---|
| `/student/*` | Valid JWT with `STUDENT` role |
| `/parent/*` | Valid JWT with `PARENT` role |
| `/admin/*` | Valid JWT with `ADMIN` role |
| `/api/students/*` | Validated inside each route handler (`STUDENT` role) |
| `/api/parents/*` | Validated inside each route handler (`PARENT` role) |
| `/api/ai/*` | Validated inside each route handler (role-specific) |
| `/explore/*`, `/`, `/auth/*` | Public |

Unauthenticated page requests redirect to `/auth/login?redirect=<original-path>`. Unauthenticated API requests return `401 Unauthorized`.

---

## Password Requirements

Passwords must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number. Enforced by Zod on the server; the registration form validates client-side as well.
