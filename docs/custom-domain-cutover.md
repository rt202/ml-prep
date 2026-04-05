# ML Prep Custom Domain Cutover

This app is split into two production surfaces:

- the frontend Vercel project that currently serves `mlprep.vercel.app`
- the API/backend Vercel project that serves the `/api` endpoints

Moving the frontend to `mlprep.org` is mostly a Vercel + Cloudflare DNS task, but this repo also has one important application-level requirement: the backend must allow the new frontend origin.

## What To Change In Code

- `server/index.js`
  - `https://mlprep.org` and `https://www.mlprep.org` are included in the default CORS allowlist.
  - `CORS_ORIGINS` is now honored, so production can add or override origins without another code change.
- `src/components/Header.jsx`
  - Supports an optional `VITE_PORTFOLIO_URL` so the app can link back to the portfolio once that site has its own domain.

## Vercel Steps

1. Open the frontend Vercel project for ML Prep.
2. Add `mlprep.org` as a custom domain.
3. Add `www.mlprep.org` as a second custom domain.
4. Make `mlprep.org` the primary hostname and configure `www` to redirect to it.
5. Wait for Vercel to show the exact DNS records it expects.

## Cloudflare Steps

1. In Cloudflare DNS, create the apex/root record requested by Vercel.
   - In most Vercel setups this is `A @ -> 76.76.21.21`.
2. Create the `www` record requested by Vercel.
   - In most Vercel setups this is `CNAME www -> cname.vercel-dns.com`.
3. Set both records to `DNS only` during verification if Vercel cannot validate while proxied.
4. In Cloudflare SSL/TLS, use `Full` or `Full (strict)`.
5. Do not use `Flexible`, which commonly causes redirect loops with Vercel.

## Environment Checks

Frontend Vercel project:

- `VITE_API_BASE_URL` should still point to the production API host.
- `VITE_PORTFOLIO_URL` can be set later when the portfolio has its own domain.

Backend Vercel project:

- `CORS_ORIGINS` should include:
  - `https://mlprep.vercel.app`
  - `https://mlprep.org`
  - `https://www.mlprep.org`
- Supabase variables do not need to change just because the frontend domain changes.

## Supabase Auth Checks

If Supabase Auth uses redirect URLs or site URLs in the dashboard, add:

- `https://mlprep.org`
- `https://www.mlprep.org`

Do not rotate keys unless there is an actual key problem. A domain migration usually does not require new Supabase credentials.

## Verification Checklist

After DNS propagates and Vercel issues the certificate, verify:

- `https://mlprep.org` loads successfully
- `https://www.mlprep.org` redirects to `https://mlprep.org`
- login/signup still work
- authenticated API-backed pages still work
- browser devtools show no CORS errors
- `mlprep.vercel.app` still works as a fallback hostname unless you intentionally disable it

## Rollback

If anything breaks after cutover:

1. Re-check the frontend custom domain status in Vercel.
2. Re-check Cloudflare DNS record values and proxy status.
3. Confirm backend `CORS_ORIGINS` includes the live frontend origin.
4. Confirm Supabase redirect URLs include the custom domain.
5. Temporarily use `mlprep.vercel.app` while debugging if needed.
