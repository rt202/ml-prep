# Local Development Environment Setup

This guide helps you set up local development with Supabase integration.

---

## Backend Environment Setup

### Step 1: Create the backend environment file

In your terminal, run:

```bash
cd /Users/ronak/Desktop/CodingProjects/interview_prep/server
touch .env.development
```

### Step 2: Open the file and paste this content

```bash
# Backend Local Development Environment
# This file is for LOCAL TESTING ONLY - not committed to git
# Copy your Supabase keys from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

# Supabase Configuration
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...YOUR_SERVICE_ROLE_KEY_HERE...
SUPABASE_ANON_KEY=eyJ...YOUR_ANON_KEY_HERE...

# Session Configuration
# Using the generated session secret - DO NOT CHANGE unless you want to log out all users
SESSION_SECRET=bjIUYtrzsXky6mtEJvbwjqYWdO/pxuQosnDTwwRnVEGLF4qulZoIg0PQmB+okixFZX9TJJZ3nXyvYJXsIK/2tg==

# CORS Configuration
# Allow requests from local frontend development server
CORS_ORIGINS=http://localhost:5173

# Environment
NODE_ENV=development

# Port
PORT=3001
```

### Step 3: Replace the placeholder values

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy and replace:
   - `SUPABASE_URL` → Your Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` → Your service_role key (secret!)
   - `SUPABASE_ANON_KEY` → Your anon/public key

**Note**: The `SESSION_SECRET` is already filled in with the generated value.

---

## Frontend Environment Setup

### Step 1: Create the frontend environment file

In your terminal, run:

```bash
cd /Users/ronak/Desktop/CodingProjects/interview_prep
touch .env.development
```

### Step 2: Open the file and paste this content

```bash
# Frontend Local Development Environment
# Only VITE_* variables are exposed to the browser

# Supabase Configuration (Public keys only!)
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...YOUR_ANON_KEY_HERE...

# Backend API URL (local development server)
VITE_API_BASE_URL=http://localhost:3001
```

### Step 3: Replace the placeholder values

Use the **same** values from your Supabase dashboard:
- `VITE_SUPABASE_URL` → Your Project URL (same as backend)
- `VITE_SUPABASE_ANON_KEY` → Your anon/public key (same as backend)

**⚠️ IMPORTANT**: Never put `SUPABASE_SERVICE_ROLE_KEY` in the frontend env file!

---

## Quick Setup Commands

Copy and paste these commands to create both files quickly:

```bash
# Create backend env file
cat > /Users/ronak/Desktop/CodingProjects/interview_prep/server/.env.development << 'EOF'
# Backend Local Development Environment
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...YOUR_SERVICE_ROLE_KEY_HERE...
SUPABASE_ANON_KEY=eyJ...YOUR_ANON_KEY_HERE...
SESSION_SECRET=bjIUYtrzsXky6mtEJvbwjqYWdO/pxuQosnDTwwRnVEGLF4qulZoIg0PQmB+okixFZX9TJJZ3nXyvYJXsIK/2tg==
CORS_ORIGINS=http://localhost:5173
NODE_ENV=development
PORT=3001
EOF

# Create frontend env file
cat > /Users/ronak/Desktop/CodingProjects/interview_prep/.env.development << 'EOF'
# Frontend Local Development Environment
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...YOUR_ANON_KEY_HERE...
VITE_API_BASE_URL=http://localhost:3001
EOF
```

Then edit both files to replace the placeholder values with your actual Supabase keys.

---

## Verification

After setting up, test that everything works:

```bash
# Start the development servers
cd /Users/ronak/Desktop/CodingProjects/interview_prep
npm run dev
```

You should see:
- ✅ Backend server starting on http://localhost:3001
- ✅ Frontend dev server starting on http://localhost:5173
- ✅ No Supabase configuration errors in console

---

## Environment Variables Reference

### Backend Variables (`server/.env.development`)

| Variable | Purpose | Source | Secret? |
|----------|---------|--------|---------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → API | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend admin access to Supabase | Supabase Dashboard → API → service_role | **YES** |
| `SUPABASE_ANON_KEY` | Public Supabase key | Supabase Dashboard → API → anon | No |
| `SESSION_SECRET` | Encrypts user sessions | Generated (see below) | **YES** |
| `CORS_ORIGINS` | Allowed frontend URLs | Your frontend URL | No |
| `NODE_ENV` | Environment mode | Set to `development` | No |
| `PORT` | Backend server port | Set to `3001` | No |

### Frontend Variables (`.env.development`)

| Variable | Purpose | Source | Secret? |
|----------|---------|--------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Same as backend | No |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase key | Same as backend | No |
| `VITE_API_BASE_URL` | Backend API URL | Your backend URL | No |

---

## Generating a New SESSION_SECRET

If you ever need to generate a new session secret:

### Method 1: OpenSSL
```bash
openssl rand -base64 64
```

### Method 2: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### Current Session Secret (Generated)
```
bjIUYtrzsXky6mtEJvbwjqYWdO/pxuQosnDTwwRnVEGLF4qulZoIg0PQmB+okixFZX9TJJZ3nXyvYJXsIK/2tg==
```

**Note**: Changing this will log out all users. Keep it consistent across environments if you want sessions to persist.

---

## Security Reminders

- ✅ These files are already in `.gitignore` - they won't be committed
- ✅ Never share your `SUPABASE_SERVICE_ROLE_KEY` publicly
- ✅ Only `VITE_*` prefixed variables are exposed to the browser
- ✅ If keys are exposed, rotate them immediately in Supabase dashboard
- ✅ The service role key bypasses ALL row-level security - keep it secret!

---

## For Production (Vercel)

Use these same values in Vercel's environment variables, but change:

### Vercel Backend Environment Variables
```bash
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co  # Same as local
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Same as local
SUPABASE_ANON_KEY=eyJ...  # Same as local
SESSION_SECRET=bjIUYtrzsXky6mtEJvbwjqYWdO/pxuQosnDTwwRnVEGLF4qulZoIg0PQmB+okixFZX9TJJZ3nXyvYJXsIK/2tg==  # Same as local
CORS_ORIGINS=https://mlprep.vercel.app,https://mlprep.org,https://www.mlprep.org  # Include every production frontend origin
NODE_ENV=production  # ⚠️ CHANGE to production
PORT=3001  # Same as local
```

### Vercel Frontend Environment Variables
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co  # Same as local
VITE_SUPABASE_ANON_KEY=eyJ...  # Same as local
VITE_API_BASE_URL=https://your-backend.vercel.app  # ⚠️ CHANGE to your Vercel backend URL
VITE_PORTFOLIO_URL=https://your-portfolio-domain.com  # Optional "About Ronak" link in the app header
```

---

## Troubleshooting

### "Supabase not configured" error
- ✅ Check that all three Supabase env vars are set correctly
- ✅ Verify the URL doesn't have trailing slashes
- ✅ Restart the dev server after changing env files
- ✅ Run `npm run dev` from the project root

### CORS errors in browser
- ✅ Verify `CORS_ORIGINS` matches your frontend URL exactly
- ✅ Check that backend is running on port 3001
- ✅ Clear browser cache and reload
- ✅ Check browser console for specific CORS error messages

### Session/auth issues
- ✅ Verify `SESSION_SECRET` is set and matches across environments
- ✅ Check that cookies are enabled in browser
- ✅ Verify Supabase Auth is enabled in dashboard
- ✅ Check that redirect URLs are configured in Supabase

### Backend won't start
- ✅ Check that `server/.env.development` exists
- ✅ Verify all required env vars are present
- ✅ Check terminal for specific error messages
- ✅ Run `npm install` to ensure dependencies are installed

### Frontend can't reach backend
- ✅ Verify backend is running (check http://localhost:3001/api/health)
- ✅ Check `VITE_API_BASE_URL` in `.env.development`
- ✅ Look for CORS errors in browser console
- ✅ Restart both frontend and backend servers

---

## File Locations

```
interview_prep/
├── .env.development              ← Frontend environment (local)
├── server/
│   └── .env.development          ← Backend environment (local)
├── env.development.example       ← Frontend template
└── server/
    └── env.development.example   ← Backend template
```

---

## Where to Get Supabase Keys

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Log in to your account

2. **Select Your Project**
   - Click on your interview prep project

3. **Navigate to API Settings**
   - Click ⚙️ Settings (bottom left)
   - Click "API" in the left sidebar

4. **Copy Your Keys**
   - **Project URL**: Copy the URL under "Project URL"
   - **anon/public key**: Copy the key under "Project API keys" → `anon` `public`
   - **service_role key**: Click "Reveal" next to `service_role` and copy

---

## Quick Reference: What Goes Where

| Key Type | Backend | Frontend | Vercel Backend | Vercel Frontend |
|----------|---------|----------|----------------|-----------------|
| Project URL | ✅ | ✅ (VITE_) | ✅ | ✅ (VITE_) |
| Anon Key | ✅ | ✅ (VITE_) | ✅ | ✅ (VITE_) |
| Service Role | ✅ | ❌ NEVER | ✅ | ❌ NEVER |
| Session Secret | ✅ | ❌ | ✅ | ❌ |

Note: I have the proper keys set up in my vercel project. do not suggest adding the keys for a solution unless you are SURE that it will fix the problem at hand.

---

## Additional Resources

- 📚 Supabase Docs: https://supabase.com/docs
- 🔐 Environment Variables Best Practices: https://12factor.net/config
- 🚀 Vercel Environment Variables: https://vercel.com/docs/environment-variables
- 📖 Project Context: See `docs/cursor.md`
- 🔄 Release Workflow: See `docs/release-workflow.md`
