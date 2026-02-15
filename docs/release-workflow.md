# Branch and Release Workflow (Local-first, Hosting Deferred)

## Branch model
- `feature/*` -> individual work
- `develop` -> integrated development branch
- `can_rel` -> release candidate / canary validation branch
- `main` -> production-ready branch
- `hotfix/*` -> urgent patches for `main`

## Promotion path
1. Merge `feature/*` into `develop`.
2. Stabilize on `develop`, then merge to `can_rel`.
3. Validate release candidate, then merge to `main`.

## CI policy
- PR to `develop`, `can_rel`, `main` must pass CI.
- CI currently runs build + backend syntax checks.
- Deployment jobs are intentionally deferred until hosting is selected.

## Suggested versioning
- Use semantic tags on `main`:
  - `v0.x.y` during pre-1.0
- Create release notes from merged PRs.
