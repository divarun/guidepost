# Guidepost — Technical Reference

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes (prod) | `fallback-secret-change-in-production` | Signs auth tokens — use a long random string in production |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime (`s`, `m`, `h`, `d`, `w`, `y` suffixes) |
| `NVIDIA_NIM_API_KEY` | For AI | — | API key from [integrate.api.nvidia.com](https://integrate.api.nvidia.com) |
| `NVIDIA_NIM_BASE_URL` | No | `https://integrate.api.nvidia.com/v1` | NIM endpoint |
| `NVIDIA_NIM_MODEL` | No | `meta/llama-3.1-70b-instruct` | Model to use for generation |
| `NODE_ENV` | No | `development` | Controls cookie `Secure` flag |

The Docker Compose default database is `postgresql://college:college@localhost:5432/college`. Copy that into `DATABASE_URL` if using the included compose file.

---

## Docker Compose

The included `docker-compose.yaml` runs a single Postgres 16 container.

```bash
docker compose up -d        # start
docker compose down         # stop (data persists in volume)
docker compose down -v      # stop and wipe data
```

Container: `guidepost-postgres` on port `5432`. Database, user, and password are all `college`.

---

## Database Scripts

| Script | What it does |
|---|---|
| `npm run db:migrate` | Run pending migrations (`prisma migrate dev`) |
| `npm run db:push` | Push schema without migrations (`prisma db push`) |
| `npm run db:seed` | Seed demo data (`prisma/seed.ts`) |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Open Prisma Studio at `localhost:5555` |

Typical setup flow: `db:migrate` → `db:seed`. Use `db:push` for quick schema experiments without migration history.

---

## Project Structure

```
src/
  app/
    api/
      ai/
        essay-feedback/          POST — AI essay feedback (students)
        financial-aid-summary/   POST — AI document analysis (parents)
      auth/
        login/                   POST
        logout/                  POST
        me/                      GET
        register/                POST
      admin/
        users/                   GET
      parents/
        budgets/                 GET, POST, PATCH, DELETE
        link-student/            POST
        student-progress/        GET
        tasks/                   GET, POST, PATCH, DELETE
      students/
        essays/                  GET, POST, PATCH, DELETE
        progress/                GET
        tasks/                   GET, POST, PATCH, DELETE
    auth/
      login/
      register/
    admin/
      dashboard/
    explore/
      students/
      parents/
    parent/
      budgets/
      dashboard/
      financial-aid/
      student-progress/
    student/
      dashboard/
      essays/[id]/
      essays/
      tasks/
      timeline/
    layout.tsx
    page.tsx                     Landing page
  components/
    layout/
      Header.tsx
      Sidebar.tsx
      TopBar.tsx
    ui/
      Button.tsx
      Card.tsx
      Input.tsx
      Modal.tsx
      Select.tsx
      Spinner.tsx
      Textarea.tsx
      Toast.tsx
  lib/
    ai/
      guardrails.ts
      nvidia-nim.ts
      prompts.ts
    constants/
      mockData.ts
      timelineData.ts
    types/
      auth.ts
      index.ts
      parent.ts
      student.ts
    utils/
      dates.ts
      formatters.ts
      validators.ts
    auth.ts
    cache.ts
    prisma.ts
    ratelimit.ts
prisma/
  migrations/
  schema.prisma
  seed.ts
```

---

## User Roles

| Role | Description | Key capabilities |
|---|---|---|
| `STUDENT` | High school student | Tasks, essays, progress dashboard, timeline, AI essay feedback |
| `PARENT` | Parent/guardian | Budgets, financial aid tasks, AI document analysis, linked student view |
| `ADMIN` | Platform admin | User list (`/admin/dashboard`) |

Role is set at registration and cannot be changed by the user. Explore pages (`/explore/students`, `/explore/parents`) are publicly accessible without an account.

---

## Auth & Route Protection

Auth uses JWT stored in an `httpOnly` cookie (`auth_token`, 7-day expiry). There is no middleware file — each API route handler calls `getCurrentUser()` and returns 401/403 directly.

```
Unauthenticated → 401
Wrong role      → 401 (same response to avoid role enumeration)
Own resource    → 200
Other user's resource → 403 or 404
```

`getCurrentUser()` decodes the cookie and returns `{ id, email, role }`. Database is not hit on every request — the role and id are read from the token.

### Password requirements

Validated server-side with Zod at registration:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit

---

## Rate Limiting

In-memory, fixed-window per user. No Redis required.

| Limiter | Limit | Window |
|---|---|---|
| General (`generalRateLimiter`) | 100 requests | 60 seconds |
| AI (`aiRateLimiter`) | 10 requests | 60 seconds |

The window is fixed from the first request in that window (not rolling). On limit breach the response includes `remaining: 0` and `resetAt` (Unix ms).

---

## AI Features

AI calls go to NVIDIA NIM (OpenAI-compatible API). If `NVIDIA_NIM_API_KEY` is not set, AI routes return 503. All AI interactions are logged to the `AIInteraction` table.

### `POST /api/ai/essay-feedback`

Role: `STUDENT` only.

Request body:
```json
{
  "essayId": "uuid",
  "content": "essay text",
  "prompt": "college application prompt"
}
```

Response:
```json
{
  "success": true,
  "feedback": {
    "narrativeClarity": { "score": 8, "comments": "..." },
    "promptAlignment": { "score": 7, "comments": "..." },
    "specificityVsGenerality": { "score": 9, "comments": "..." },
    "revisionSuggestions": ["...", "..."],
    "overallAssessment": "..."
  }
}
```

Side effects: creates `EssayFeedback` row (`isAI: true`) and `AIInteraction` row.

Content is validated before sending to AI: max length check + safety guardrail (blocks harmful content).

---

### `POST /api/ai/financial-aid-summary`

Role: `PARENT` only.

Request body:
```json
{
  "documentType": "fafsa" | "award-letter" | "scholarship",
  "content": "pasted document text"
}
```

Response:
```json
{
  "success": true,
  "summary": {
    "keyPoints": ["...", "..."],
    "importantDeadlines": ["...", "..."],
    "actionItems": ["...", "..."],
    "financialBreakdown": { ... } | null
  }
}
```

Side effects: creates `AIInteraction` row. No separate feedback table for financial aid.

---

## Parent–Student Linking

A parent links to a student via `POST /api/parents/link-student` with `{ studentEmail }`.

Rules:
- A parent can only be linked to one student (409 if already linked).
- A student can only be claimed by one parent (409 if already claimed).
- The target account must exist and have role `STUDENT`.
- The link is stored as `studentId` on the parent's `User` row (self-referential Prisma relation).

To change a link, contact support — the UI does not expose an unlink flow.

---

## Demo Accounts

Seeded by `npm run db:seed`:

| Role | Email | Password |
|---|---|---|
| Student | `student1@example.com` | `password123` |
| Parent | `parent1@example.com` | `password123` |

`parent1` is pre-linked to `student1`.
