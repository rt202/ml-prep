# Supabase Go-Live Prompt Runbook (Lyra-Style)

Use this document as the single source of truth when implementing Supabase migration, deployment, and release workflow for this project.

---

## Current Scope (No Hosting Yet)

**Confirmed scope:** we are **not** setting up Vercel or any backend host right now.  
We will run the app locally and use Supabase as the external managed backend service.

### Recommended order for this scope
1. Local integration complete (Supabase auth + DB + RLS + API wiring).
2. Local envs configured in root and `server/`.
3. Local verification complete (`build`, auth flows, admin flows).
4. Prepare deploy-ready docs/branches now; defer hosting activation.

---

## Backend Hosting Options (Deferred Reference)

### Render
**Pros**
- Easiest onboarding for Node/Express.
- Stable deploy flow; good logs.
- Straightforward env var management.

**Cons**
- Free-tier sleep/cold starts can be noticeable.
- Less flexible low-level tuning than Fly.

### Railway
**Pros**
- Very fast setup and DX.
- Great for quick internal/canary environments.
- Simple service/database linking.

**Cons**
- Pricing/quotas can change; monitor usage carefully.
- Can be less predictable for long-lived free usage.

### Fly.io
**Pros**
- Best control/performance tuning for small apps.
- Multi-region capable; strong scalability path.
- Fine-grained machine sizing.

**Cons**
- Highest setup complexity.
- More ops overhead than Render/Railway.

### Recommendation when you are ready to deploy
- Start with **Render** for backend (lowest operational friction).
- Use **Vercel** for frontend.
- Move to **Fly** later if you need performance tuning/global routing.

---

## Critical Key/Env Placement (Specific)

## IMPORTANT
- `sb_secret_*` (service role key) is **backend-only**.
- `sb_publishable_*` / anon key is **frontend-safe**.
- Never commit `.env*` files.

### 1) Frontend env files (project root)
Prepared templates:
- `env.development.example`
- `env.canary.example`
- `env.production.example`

Create actual local files by copying:
```bash
cp env.development.example .env.development
cp env.canary.example .env.canary
cp env.production.example .env.production
```

Add:
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxx
VITE_API_BASE_URL=http://localhost:3001
```

Use in frontend code only via `import.meta.env.VITE_*`.

### 2) Backend env files (`server/`)
Prepared templates:
- `server/env.development.example`
- `server/env.canary.example`
- `server/env.production.example`

Create actual local files by copying:
```bash
cp server/env.development.example server/.env.development
cp server/env.canary.example server/.env.canary
cp server/env.production.example server/.env.production
```

Add:
```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx
SUPABASE_ANON_KEY=sb_publishable_xxx
SESSION_SECRET=replace-with-random-64+char-secret
CORS_ORIGINS=http://localhost:5173
NODE_ENV=development
PORT=3001
```

### 3) Git ignore
Ensure `.gitignore` contains:
```bash
.env
.env.*
server/.env
server/.env.*
```

### 4) Platform env config (Deferred)
- Not needed yet for current scope.
- Keep this section for when deployment starts.

---

## Optimized Execution Prompt (Copy/Paste)

Use this prompt to execute the migration reliably with anti-hallucination controls.

```md
<instructions>
You are implementing Supabase migration + deployment hardening for this repo.
Follow this exact order and do not skip verification gates.
Use verification labels for uncertain claims:
- [VERIFIED]
- [INFERENCE]
- [UNVERIFIED]
- [MISSING]
If information is missing, say: "I cannot verify X from current repo state."
</instructions>

<data>
Project goals:
1) Replace local DB/file auth/progress storage with Supabase-backed implementation.
2) Keep current API behavior compatible where possible.
3) Add secure env strategy for dev/can_rel/prod.
4) Add CI/CD branch flow for develop/can_rel/main.
5) Keep deployment docs branch-ready, but do not configure cloud hosting yet.
</data>

<check>
Before each phase:
- List files to change.
- State assumptions.
- State rollback approach.
After each phase:
- Run build/lint/tests.
- Confirm endpoint behavior with concise output.
</check>

<management>
Context discipline:
- Keep responses short and structured.
- Do not invent Supabase limits; if uncertain, label [UNVERIFIED].
- Use current repo file paths only.
</management>

Execute phases:

PHASE 1: Supabase Foundation
- Add backend Supabase client module.
- Add frontend Supabase auth client module.
- Add env parsing/validation utilities.
- Add `.env.example` and `server/.env.example`.

PHASE 2: Auth Migration
- Migrate login/signup/logout/session checks to Supabase Auth.
- Ensure backend validates JWT and derives user identity.
- Remove insecure custom session handling if redundant.

PHASE 3: Data Migration
- Replace SQLite/file-based reads/writes with Supabase/Postgres operations.
- Preserve API contracts (`/api/stats`, `/api/progress`, `/api/recommended`, etc.).
- Add migration SQL + seed SQL (admin bootstrap).

PHASE 4: RLS + Security
- Enable RLS for all user-owned tables.
- Add SQL policies for user-scoped access and admin operations.
- Verify service role key never appears in frontend bundle/code.

PHASE 5: Admin & Content
- Ensure admin endpoints enforce role checks.
- Keep admin content CRUD publish/unpublish flow functional.
- Add audit log writes for all admin mutations.

PHASE 6: Local-Only Release Readiness
- Add branch-aware workflow docs:
  - develop -> dev
  - can_rel -> canary
  - main -> production
- Keep CI checks ready.
- Do not create cloud deployment jobs in this scope.

PHASE 7: Verification
- Run build + lint.
- Verify auth flow, profile updates, question progression, admin role assignment.
- Provide final report:
  - [VERIFIED] completed items
  - [MISSING] anything not completed + exact blocker
```

---

## Supabase Setup Requirements Checklist (Complete)

- [ ] Rotate any exposed keys immediately.
- [ ] Create separate envs for dev/canary/prod.
- [ ] Configure Supabase Auth (email/password).
- [ ] Configure allowed redirect URLs.
- [ ] Apply schema migrations.
- [ ] Enable RLS on all relevant tables.
- [ ] Apply RLS policies.
- [ ] Seed admin user/profile mapping (`ro` admin if desired).
- [ ] Configure CORS for local origin(s).
- [ ] Add CI checks (local/build/lint/test).
- [ ] Validate app end-to-end locally.

---

## Git Branching / Release Model

- `develop`: active integration branch (dev deploy target).
- `can_rel`: candidate stabilization branch (canary deploy target).
- `main`: production branch.
- `feature/*`: individual tasks.
- `hotfix/*`: emergency prod fixes.

Promotion path:
`feature/* -> develop -> can_rel -> main`

---

## Minimal Public Launch Checklist

- [ ] HTTPS + custom domain configured.
- [ ] Basic rate limiting on auth and write endpoints.
- [ ] Health check endpoints and uptime monitor.
- [ ] Error logging (frontend + backend).
- [ ] Backup/restore strategy documented.
- [ ] Privacy + terms page published.

---

## What You Need To Provide (From Your End)

For local setup completion, fill these exact values into env files:

1. `VITE_SUPABASE_URL`  
   - Value: your Supabase project URL

2. `VITE_SUPABASE_ANON_KEY`  
   - Value: your publishable key (`sb_publishable_...`)

3. `SUPABASE_URL`  
   - Value: same Supabase project URL

4. `SUPABASE_SERVICE_ROLE_KEY`  
   - Value: your secret key (`sb_secret_...`)  
   - Backend-only; never put this in root frontend env as `VITE_*`

5. `SUPABASE_ANON_KEY`  
   - Value: same publishable key (used by backend where needed)

6. `SESSION_SECRET`  
   - Generate a random long string (64+ chars)

7. `CORS_ORIGINS`  
   - For now: `http://localhost:5173`

### Key safety instructions
- Rotate any previously shared key values.
- Store keys only in local env files and platform secrets later.
- Confirm `.gitignore` excludes `.env*` and `server/.env*`.

---

## Notes

- For your current expected load (~3 concurrent users), this architecture should fit comfortably on free tiers if query patterns are efficient and indexed.
- Keep expensive analytics/background processing out of request path until usage grows.
