# Project Context & AI Assistant Guidelines

This document serves as the primary context source for AI assistants working on this project. Read this file before making any code changes or architectural decisions.

---

## Project Overview

**Application Name**: Interview Prep Platform  
**Primary Goal**: Help users prepare for Machine Learning (ML) interviews by understanding both theory and practice of ML/AI/Software Engineering techniques.

### Core Mission
- Provide comprehensive ML/AI/SWE interview preparation
- Balance theoretical understanding with practical application
- Enable users to track progress through structured learning paths
- Offer spaced repetition and personalized review queues
- Support admin-managed content for quality control during development process

---

## Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.0
- **Routing**: React Router DOM 6.28.0
- **Styling**: TailwindCSS 3.4.15
- **Animations**: Framer Motion 11.11.0
- **Icons**: Lucide React 0.460.0

### Backend
- **Runtime**: Node.js (Express 4.21.0)
- **Database**: Supabase (PostgreSQL) + Auth
- **Local Fallback**: SQLite (for development)
- **API**: REST endpoints

### Development Tools
- **Package Manager**: npm
- **Concurrent Processes**: concurrently (dev server + client)
- **Module System**: ES Modules (type: "module")

---

## Project Structure

```
interview_prep/
├── src/                          # Frontend React application
│   ├── components/              # UI components
│   │   ├── AuthScreen.jsx       # Login/signup
│   │   ├── Dashboard.jsx        # Main user dashboard
│   │   ├── UnitMap.jsx          # Learning path visualization
│   │   ├── Quiz.jsx             # Question interface
│   │   ├── ReviewQueue.jsx      # Spaced repetition system
│   │   ├── AdminPanel.jsx       # Content management
│   │   └── ...
│   ├── context/                 # React context providers
│   │   ├── AuthContext.jsx      # Authentication state
│   │   ├── ThemeContext.jsx     # Theme management
│   │   └── UserProfileContext.jsx
│   ├── utils/                   # Utility functions
│   │   ├── api.js               # API client
│   │   └── supabaseAuth.js      # Supabase auth wrapper
│   └── main.jsx                 # App entry point
│
├── server/                       # Backend Express server
│   ├── index.js                 # Server entry point
│   ├── supabase.js              # Supabase client
│   ├── db.js                    # Database operations
│   ├── loadEnv.js               # Environment config loader
│   ├── data/                    # Question bank & content
│   │   ├── questions-part1-5.js # Question sets
│   │   ├── units.js             # Learning unit definitions
│   │   ├── app.sqlite           # Local dev database
│   │   └── progress.json        # Local progress tracking
│   └── sql/                     # Supabase migrations
│       ├── 001_schema.sql       # Database schema
│       ├── 002_rls.sql          # Row-level security
│       └── 003_seed.sql         # Initial data
│
├── docs/                        # Documentation
│   ├── cursor.md                # This file
│   ├── release-workflow.md      # Git branching strategy
│   └── supabase-go-live-lyra-prompt.md  # Deployment runbook
│
├── env.*.example                # Frontend env templates
├── server/env.*.example         # Backend env templates
└── package.json                 # Dependencies & scripts
```

---

## Validation Loop (CRITICAL - Run After Every Change)

Before considering any work complete, **ALWAYS** run this validation sequence:

### 1. Build Validation
```bash
npm run build
```
**Purpose**: Ensure frontend compiles without errors  
**Expected**: Clean build output in `dist/`, no TypeScript/JSX errors  
**On Failure**: Fix all build errors before proceeding

### 2. Linting (if configured)
```bash
npm run lint  # (add this script if not present)
```
**Purpose**: Check code quality and style  
**Expected**: No linting errors  
**On Failure**: Fix linting issues or document exceptions

### 3. Server Start Test
```bash
npm run dev:server
```
**Purpose**: Verify backend starts without crashes  
**Expected**: Server listening on configured port (default 3001)  
**On Failure**: Check env vars, dependencies, syntax errors

### 4. Client Start Test
```bash
npm run dev:client
```
**Purpose**: Verify frontend dev server starts  
**Expected**: Vite dev server running on port 5173  
**On Failure**: Check build config, dependencies

### 5. Full Integration Test
```bash
npm run dev
```
**Purpose**: Run both client and server concurrently  
**Expected**: Both services start successfully, no console errors  
**On Failure**: Check logs for startup issues

### 6. Manual Smoke Test Checklist
- [ ] Application loads in browser (http://localhost:5173)
- [ ] No console errors in browser dev tools
- [ ] Authentication flow works (if auth-related changes)
- [ ] Navigation between pages works
- [ ] API endpoints respond correctly (check Network tab)
- [ ] Database operations succeed (if DB-related changes)
- [ ] Admin features work (if admin-related changes)

### 7. Specific Feature Validation
If you modified:
- **Auth**: Test login, signup, logout, session persistence
- **Questions**: Test question rendering, answer submission, progress tracking
- **Admin**: Test content CRUD, publish/unpublish, role checks
- **API**: Test affected endpoints with sample requests
- **Database**: Verify migrations apply cleanly, RLS policies work

### Validation Protocol
1. Run ALL relevant validations before marking work complete
2. If ANY validation fails, fix it immediately
3. Document any known issues or limitations
4. Never skip validation "to save time"
5. Report validation results in your final summary

---

## Environment Configuration

### Frontend Environment Variables (Project Root)
Create from templates:
```bash
cp env.development.example .env.development
cp env.canary.example .env.canary
cp env.production.example .env.production
```

Required variables:
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxx  # Public key (safe for frontend)
VITE_API_BASE_URL=http://localhost:3001
```

### Backend Environment Variables (Server Directory)
Create from templates:
```bash
cp server/env.development.example server/.env.development
cp server/env.canary.example server/.env.canary
cp server/env.production.example server/.env.production
```

Required variables:
```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx  # SECRET - Backend only!
SUPABASE_ANON_KEY=sb_publishable_xxx
SESSION_SECRET=random-64-char-string
CORS_ORIGINS=http://localhost:5173
NODE_ENV=development
PORT=3001
```

### Security Rules
- **NEVER** commit `.env*` files (git ignore enforced)
- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to frontend
- Only `VITE_*` prefixed vars are exposed to frontend bundle
- Rotate keys immediately if accidentally exposed

---

## Git Branching & Release Workflow

### Branch Model
- `feature/*` → Individual feature development
- `develop` → Integration branch for active development
- `can_rel` → Release candidate / canary validation
- `main` → Production-ready code
- `hotfix/*` → Emergency production fixes

### Promotion Path
```
feature/* → develop → can_rel → main
```

### Branch Rules
- All PRs to `develop`, `can_rel`, `main` must pass CI
- CI runs: build validation + backend syntax checks
- No direct commits to protected branches
- Use semantic versioning on `main` (`v0.x.y` for pre-1.0)

### Release Process
1. Merge completed features into `develop`
2. Stabilize and test on `develop`
3. Merge `develop` → `can_rel` for release candidate
4. Validate canary environment
5. Merge `can_rel` → `main` for production release
6. Tag release with version number

**Note**: Deployment automation is deferred until hosting is configured. Currently local-first development.

---

## Key Application Features

### User-Facing Features
1. **Authentication**: Email/password via Supabase Auth
2. **Learning Paths**: Structured units covering ML/AI/SWE topics
3. **Question Bank**: Multiple-choice and practice questions
4. **Progress Tracking**: User stats, completion rates, streaks
5. **Spaced Repetition**: Review queue based on performance
6. **Leaderboard**: Competitive progress tracking
7. **User Profiles**: Personalized dashboard and settings
8. **Theme Support**: Light/dark mode toggle

### Admin Features
1. **Content Management**: CRUD operations for questions/units
2. **Publish/Unpublish**: Control content visibility
3. **User Management**: View user stats, assign roles
4. **Audit Logging**: Track admin actions
5. **Analytics**: Usage and performance metrics

### Core Concepts
- **Units**: Thematic learning modules (e.g., "Supervised Learning", "Neural Networks")
- **Questions**: Individual practice items with explanations
- **Progress**: User completion state per question/unit
- **Stats**: Performance metrics (accuracy, speed, consistency)
- **Review Queue**: Adaptive spaced repetition algorithm

---

## API Endpoints (Current)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/session` - Session validation

### User Data
- `GET /api/stats` - User statistics
- `GET /api/progress` - Learning progress
- `POST /api/progress` - Update progress
- `GET /api/recommended` - Personalized recommendations

### Content
- `GET /api/units` - Learning units
- `GET /api/questions` - Question bank
- `GET /api/question/:id` - Single question

### Admin (Role-Protected)
- `POST /api/admin/questions` - Create question
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question
- `POST /api/admin/publish/:id` - Publish content
- `POST /api/admin/unpublish/:id` - Unpublish content

**Note**: All endpoints validate authentication and enforce RLS policies via Supabase.

---

## Database Schema (Supabase PostgreSQL)

### Core Tables
- **auth.users**: Supabase managed auth table
- **profiles**: User profile data (linked to auth.users)
- **units**: Learning module definitions
- **questions**: Question bank with metadata
- **user_progress**: Individual question completion tracking
- **user_stats**: Aggregated performance metrics
- **review_queue**: Spaced repetition scheduling
- **audit_logs**: Admin action tracking

### Security
- **RLS Enabled**: All user-owned tables have row-level security
- **User Policies**: Users can only read/write their own data
- **Admin Policies**: Admins can access all data for management
- **Service Role**: Backend uses service key for admin operations

---

## Common Development Tasks

### Adding a New Question
1. Use Admin Panel UI (recommended) OR
2. Add to `server/data/questions-partX.js`
3. Run backend to sync with database
4. Validate question appears in UI

### Modifying API Endpoints
1. Edit `server/index.js`
2. Update corresponding frontend API client in `src/utils/api.js`
3. Test endpoint manually (Postman/curl)
4. Verify frontend integration
5. Run full validation loop

### Adding a New React Component
1. Create component in `src/components/`
2. Import and integrate into routing/parent component
3. Test rendering and interactions
4. Check responsive design (mobile/tablet/desktop)
5. Verify theme compatibility (light/dark)

### Database Migrations
1. Create new SQL file in `server/sql/` (numbered sequentially)
2. Test migration on local Supabase instance
3. Document migration purpose and rollback steps
4. Apply to dev → canary → production environments

### Updating Dependencies
1. Check for breaking changes in release notes
2. Update `package.json`
3. Run `npm install`
4. Run full validation loop
5. Test affected functionality thoroughly

---

## Anti-Hallucination Protocol for AI Assistants

When working on this codebase:

### 1. Verification Requirements
- **[VERIFIED]**: Information confirmed from actual files
- **[INFERENCE]**: Logical assumption based on patterns
- **[UNVERIFIED]**: Not confirmed from current repo
- **[MISSING]**: Information needed but not available

### 2. Before Making Changes
- Read actual file contents (don't assume structure)
- Check current imports and dependencies
- Verify API contracts on both frontend and backend
- Confirm environment variable usage

### 3. After Making Changes
- Run the complete validation loop (above)
- Test affected features manually
- Check for unintended side effects
- Verify no console errors or warnings

### 4. Uncertainty Protocol
If you encounter:
- Missing configuration → Ask user for values
- Unclear requirements → Request clarification
- Conflicting patterns → Present options
- Ambiguous scope → Define boundaries explicitly

### 5. Never Assume
- Database schema (read migrations)
- API response formats (check actual endpoints)
- Component props (read component definitions)
- Supabase configuration (verify from actual setup)

---

## Current Project Status

### Completed
- [x] Core React frontend with routing
- [x] Express backend API server
- [x] Supabase integration (auth + database)
- [x] Question bank and content management
- [x] User progress tracking
- [x] Admin panel functionality
- [x] RLS policies and security
- [x] Environment configuration templates
- [x] Git branching workflow

### In Progress
- [ ] Deployment to hosting providers (deferred)
- [ ] CI/CD automation (local checks ready)
- [ ] Advanced analytics dashboard
- [ ] Mobile responsive refinements

### Known Limitations
- Local development only (no production deployment yet)
- Limited to ~3 concurrent users on free tier
- No automated testing suite yet
- Manual smoke testing required

---

## Critical Reminders

### For Every Code Change
1. ✅ Understand the full scope before editing
2. ✅ Read existing code patterns and follow them
3. ✅ Update both frontend and backend if API changes
4. ✅ Run validation loop before marking complete
5. ✅ Test in browser, not just build success
6. ✅ Check for console errors/warnings
7. ✅ Verify no regression in existing features

### Security Checklist
- ✅ No secrets in code or commits
- ✅ RLS policies enforced for user data
- ✅ Admin endpoints check roles
- ✅ Input validation on all user data
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (React auto-escapes)

### Best Practices
- ✅ Keep components focused and reusable
- ✅ Use context for global state (auth, theme, profile)
- ✅ Handle loading and error states in UI
- ✅ Provide user feedback for actions (success/error messages)
- ✅ Follow existing naming conventions
- ✅ Comment complex logic or algorithms
- ✅ Keep API responses consistent in structure

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Run full development environment
npm run dev

# Build production bundle
npm run build

# Preview production build
npm preview

# Run frontend only
npm run dev:client

# Run backend only
npm run dev:server
```

---

## Contact & Support

For questions about:
- **Supabase setup**: See `docs/supabase-go-live-lyra-prompt.md`
- **Release process**: See `docs/release-workflow.md`
- **Architecture decisions**: Review this document
- **Feature requests**: Create GitHub issue (if repo configured)

---

## Document Maintenance

**Last Updated**: 2026-02-15  
**Maintained By**: Project team  
**Review Cadence**: Update after major architectural changes  

This document should be the first reference for any AI assistant or new developer joining the project.
