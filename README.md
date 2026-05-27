# Guidepost

A college application platform for students and parents. Students manage tasks, write essays, and get AI-powered feedback. Parents track financial aid, compare college costs, and monitor student progress.

---

## Features

**Students**
- Task management with categories, priorities, and due dates
- Essay editor with word-count tracking and AI feedback
- Progress dashboard with overdue alerts and upcoming deadlines
- Grade-by-grade application timeline

**Parents**
- Financial aid task tracking (FAFSA, CSS Profile, scholarships)
- College budget planner — compare net costs across schools
- AI analysis of financial aid documents and award letters
- Linked student progress view

**Both**
- Role-based accounts (Student, Parent)
- Public explore pages — no account required to preview
- In-memory rate limiting (general: 100/min, AI: 10/min per user)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT in httpOnly cookies |
| AI | NVIDIA NIM (OpenAI-compatible API) |
| Validation | Zod |

---

## Quick Start

```bash
# 1. Install
git clone <repo-url> && cd guidepost && npm install

# 2. Start Postgres
docker compose up -d

# 3. Configure
cp .env.example .env   # set NVIDIA_NIM_API_KEY at minimum

# 4. Set up database
npm run db:migrate && npm run db:seed

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Student | `student1@example.com` | `password123` |
| Parent | `parent1@example.com` | `password123` |

`parent1` is pre-linked to `student1`.

---

## Environment Variables

See [details.md](details.md#environment-variables) for the full list.

The only variable required to start locally is `DATABASE_URL` (defaults work with the Docker Compose setup). Set `NVIDIA_NIM_API_KEY` to enable AI features.

> **Production:** Always set a strong, random `JWT_SECRET`. The default value is insecure.

---

For architecture, API reference, role details, and deployment notes see **[details.md](details.md)**.
