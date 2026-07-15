# Monorepo Migration Plan — Iteration 1

Merging `blog-site`, `photos`, `rtk-site`, and the current `wamphlett` homepage into a single pnpm-workspaces + Turborepo monorepo.

**The monorepo is the existing `github.com/wamphlett/wamphlett` repo.** It currently holds the homepage at the root; that homepage moves into `apps/home`, and the other three sites merge in alongside it. `wamphlett/wamphlett` becomes your one and only site repo.

**Goal of iteration 1:** get all four Next.js apps building, running, and publishing their own images from one repo. Each app keeps its own dependencies and code exactly as-is. **No shared UI, no version alignment, no shared config yet.**

---

## Current state (from your repos)

| Repo today | → Folder | Next | React | Tailwind | ESLint | Docker base | CI | Docker builds? | Deploy hook |
|------|------|------|-------|----------|--------|-------------|----|----|----|
| `wamphlett` (homepage) | `apps/home` | 13.5 | 18 | 3 | 8 | node:20 | tag `*` | ✅ `npm install` | no lab bump |
| `blog-site` | `apps/blog` | 15.5 | 18 | 3 | 8 | node:22 | tag `v*` | ✅ `output: standalone`, `npm ci`, VERSION arg | bumps lab |
| `photos` | `apps/photos` | 13.5 | 18 | 3 | 8 | node:18 | **none** | ❌ ships dev (`npm start`, no build) | — |
| `rtk-site` | `apps/rtk` | 16.1 | 19 | 4 | 9 | node:25 | tag `v*` | ✅ `npm install` | bumps lab |

**Shared deploy pattern:** push a git tag → GitHub Actions builds `ghcr.io/${{ github.repository }}:<tag>` → pushes to GHCR → edits `tanka/versions.json` in the separate `wamphlett/lab` repo (keyed by image name) → GitOps picks up the deploy. `photos` has no CI; `home` (today's `wamphlett`) skips the lab bump.

These divergences drive most of the decisions below.

---

## Naming convention

Standard monorepo house style (Turborepo / Vercel): deployables in `apps/`, shared code in `packages/`, folders short and kebab-case with **no redundant `wamphlett-` prefix** (the repo and `@wamphlett` scope already namespace them). The `@wamphlett/*` scope lives in each `package.json` `name` and is how apps will import shared packages later (`@wamphlett/ui`).

| Repo today | Folder | `package.json` name |
|---|---|---|
| `wamphlett` (homepage) | `apps/home` | `@wamphlett/home` |
| `blog-site` | `apps/blog` | `@wamphlett/blog` |
| `photos` | `apps/photos` | `@wamphlett/photos` |
| `rtk-site` | `apps/rtk` | `@wamphlett/rtk` |

> **Why `apps/` and not `sites/`:** the convention is `apps/` = *anything you deploy* (sites, APIs, workers), not literally "applications." Keeping `apps/` is the standard a new contributor expects; `sites/` would read as non-standard.

---

## Target layout

```
wamphlett/                  # the existing repo, now the monorepo (git root)
├── apps/
│   ├── home/               # today's root homepage, moved here
│   ├── blog/               # was blog-site
│   ├── photos/             # was photos
│   └── rtk/                # was rtk-site
├── packages/               # reserved for shared UI/config (iteration 3) — empty for now
├── .github/workflows/
│   ├── ci.yml              # lint + build on PR (turbo, only changed apps)
│   └── release.yml         # tag-triggered per-app image build + push
├── pnpm-workspace.yaml
├── turbo.json
├── package.json            # root: turbo + scripts only
└── .npmrc
```

---

## Tooling recommendation: Turborepo

**Use Turborepo, not Nx.** For four independent Next.js apps with no shared code (yet), Turborepo is just a task runner + cache — a ~20-line `turbo.json` and you're done. Nx buys you generators, a project graph, and a plugin system that only pay off with a lot of shared libraries and cross-project tooling; for now that's overhead and lock-in you don't need. If iteration 3+ grows into many shared packages with codegen needs, Nx can be reconsidered — but Turborepo scales fine for this size.

Package manager: **pnpm workspaces**. pnpm's isolated `node_modules` is what makes the wildly different Next/React/Tailwind majors coexist safely in one repo — each app resolves its own versions, no phantom hoisting.

---

## How versioning & publishing will work (the part you were unsure about)

Today: one repo = one image = one tag. In a monorepo a bare tag is ambiguous (which app?). The chosen model keeps things close to what you have:

**Per-app tags with a name prefix.** Tag format:

```
home-v2.0.0
blog-v0.3.0
photos-v0.3.0
rtk-v1.1.0
```

The release workflow triggers on `*-v*`, parses `${{ github.ref_name }}` into `<app>` + `<version>`, and builds **only that app**. So `git tag blog-v0.3.0 && git push --tags` publishes exactly one image, just like today.

**Image naming.** Build the image as:

```
ghcr.io/${{ github.repository_owner }}/<app>:<version>
```

i.e. `ghcr.io/wamphlett/blog:0.3.0`. Note it uses `repository_owner` (`wamphlett`), **not** `${{ github.repository }}` (which would be `wamphlett/wamphlett`). Versions are per-app and independent — there is no single "monorepo version"; the git tag is the source of truth, same as now.

*(The alternative — auto-build changed apps on merge to main — is less ceremony but gives you SHA/date "versions" instead of semver. Sticking with tags keeps your muscle memory and your lab flow. Changesets is overkill until you have shared packages whose bumps need to ripple.)*

---

## ⚠️ Lab / deploy impact (flagged for you to handle)

You're handling the `lab` side. Here's exactly what changes so you can scope it:

- **The rename changes image names**, so `tanka/versions.json` keys change **once**:
  - `ghcr.io/wamphlett/wamphlett` → `ghcr.io/wamphlett/home`
  - `ghcr.io/wamphlett/blog-site` → `ghcr.io/wamphlett/blog`
  - `ghcr.io/wamphlett/rtk-site` → `ghcr.io/wamphlett/rtk`
  - `ghcr.io/wamphlett/photos` → unchanged
  Update the keys in `versions.json` and the corresponding image refs in your tanka/jsonnet.
- The `update-lab` job now lives in the monorepo workflow and must derive `IMAGE=ghcr.io/${{ github.repository_owner }}/<app>` (from the parsed tag) instead of `ghcr.io/${{ github.repository }}`.
- `photos` currently has no lab entry / no CI. If you want it deployed the same way, add a `versions.json` key for it.
- `home` (today's `wamphlett`) currently doesn't bump lab at all — decide whether the monorepo workflow should start doing so or preserve that exception.
- `LAB_REPO_TOKEN` already exists on this repo (it's your current `wamphlett` repo), so the secret carries over. Confirm GHCR `packages: write` permission.

> If you'd rather do a **zero-touch lab** cutover, you can keep the *image names* pinned to the old strings in the workflow (folder `blog`, image still `blog-site`). Cleaner to just rename once during migration, though — doing it later means touching lab, tags, and history a second time.

---

## Migration steps (iteration 1)

### 1. Reshape the existing repo + merge the other three (history preserved)

The `wamphlett` repo is the monorepo, so its homepage gets rewritten into `apps/home`, then the other three merge in under their new folders. Uses `git-filter-repo`.

```bash
brew install git-filter-repo   # once
```

**a. Move the current homepage into `apps/home`** (run inside a fresh clone of `wamphlett`):
```bash
git clone git@github.com:wamphlett/wamphlett.git
cd wamphlett
git filter-repo --to-subdirectory-filter apps/home
```
This rewrites the whole history so it looks like the homepage always lived in `apps/home` (clean blame). It's a history rewrite → you'll force-push and re-clone; fine for a solo repo. Back up / branch first.

**b. Bring in each other site** rewritten under its new folder:
```bash
# example: blog-site -> apps/blog
git clone git@github.com:wamphlett/blog-site.git /tmp/blog
cd /tmp/blog && git filter-repo --to-subdirectory-filter apps/blog && cd -

git remote add blog /tmp/blog
git fetch blog
git merge --allow-unrelated-histories blog/main
git remote remove blog
```
Repeat for `photos` → `apps/photos` and `rtk-site` → `apps/rtk`. Then force-push the reshaped `wamphlett`. Archive the three old repos (read-only) as a safety net.

### 2. Workspace wiring

`pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`.npmrc`:
```
# keep app dependency resolution isolated; avoids surprise hoisting across major versions
node-linker=isolated
```

Root `package.json`:
```json
{
  "name": "wamphlett",
  "private": true,
  "packageManager": "pnpm@9",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  },
  "devDependencies": { "turbo": "^2" }
}
```

Rename each app's `package.json` `name` to `@wamphlett/home|blog|photos|rtk`. Delete each app's `package-lock.json`; run `pnpm install` once at the root to generate a single `pnpm-lock.yaml`. Expect peer-dependency warnings across the React 18/19 and Tailwind 3/4 splits — fine, they're isolated.

`turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "dev": { "cache": false, "persistent": true }
  }
}
```

### 3. Run all four at once (dev)

Give each app a fixed unique port so `turbo run dev` can bring them up in parallel. In each `apps/<app>/package.json`:

```jsonc
// apps/home
"dev": "next dev -p 3001"
// apps/blog
"dev": "next dev -p 3002"
// apps/photos
"dev": "next dev -p 3003"
// apps/rtk
"dev": "next dev -p 3004"
```

`pnpm dev` at the root runs all four (Turbo streams their logs). `pnpm dev --filter=@wamphlett/rtk` runs just one.

### 4. Standardize Docker builds (Turborepo `prune` pattern)

Fix while we're here: `photos` ships a dev server with no build; `home`/`photos` don't emit `output: standalone`; base images range node 18→25. Standardize on **node:22-alpine** and standalone output for lean images.

For each `apps/<app>/next.config.*` add (Next needs the workspace root to trace deps correctly):
```js
output: 'standalone',
outputFileTracingRoot: path.join(__dirname, '../../'),
```

Per-app `apps/<app>/Dockerfile` using `turbo prune` (build context = **repo root**):
```dockerfile
FROM node:22-alpine AS base
RUN corepack enable

FROM base AS pruner
WORKDIR /app
RUN npm i -g turbo@^2
COPY . .
RUN turbo prune @wamphlett/blog --docker     # <- app package name

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=@wamphlett/blog  # <- app package name

FROM base AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=installer /app/apps/blog/.next/standalone ./
COPY --from=installer /app/apps/blog/.next/static ./apps/blog/.next/static
COPY --from=installer /app/apps/blog/public ./apps/blog/public
USER appuser
ARG VERSION=unknown
ENV OTEL_RESOURCE_ATTRIBUTES=service.version=${VERSION}
EXPOSE 3000
CMD ["node", "apps/blog/server.js"]
```
(`turbo prune --docker` produces a partial monorepo with only that app's dependency closure, so installs stay small and cache well. The `VERSION`/OTel lines are only needed for `blog` today.)

### 5. CI — build only what changed (PRs)

`.github/workflows/ci.yml`: on PR, `pnpm turbo run lint build --filter=...[origin/main]` builds/lints only apps affected by the diff. Fast feedback, no wasted work on untouched apps.

### 6. Release — per-app tag → image → GHCR

`.github/workflows/release.yml`:
```yaml
on:
  push:
    tags: ['*-v*']

jobs:
  release:
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    steps:
      - uses: actions/checkout@v4
      - name: Parse tag
        id: t
        run: |
          REF="${{ github.ref_name }}"          # e.g. blog-v0.3.0
          APP="${REF%-v*}"
          VERSION="${REF##*-v}"
          echo "app=$APP"   >> "$GITHUB_OUTPUT"
          echo "version=$VERSION" >> "$GITHUB_OUTPUT"
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: ${{ github.actor }}, password: ${{ secrets.GITHUB_TOKEN }} }
      - name: Build & push
        run: |
          IMAGE=ghcr.io/${{ github.repository_owner }}/${{ steps.t.outputs.app }}
          docker build --build-arg VERSION=${{ steps.t.outputs.version }} \
            -f apps/${{ steps.t.outputs.app }}/Dockerfile \
            -t $IMAGE:${{ steps.t.outputs.version }} .
          docker push $IMAGE:${{ steps.t.outputs.version }}
      # then: update-lab job (you own this) — derive IMAGE the same way
```
`${{ steps.t.outputs.app }}` is the folder/image name (`home`/`blog`/`photos`/`rtk`); the app's `package.json` name is `@wamphlett/<app>`.

### 7. Verification (before cutover)

- `pnpm install` clean at root; single lockfile committed.
- `pnpm build` builds all four; `pnpm dev` brings all four up on 3001–3004.
- `docker build` each app locally via its Dockerfile from repo root; run the image, hit `:3000`.
- Push one throwaway tag per app (e.g. `blog-v0.0.0-test`) to confirm the release workflow tags/pushes the expected image name.
- Confirm `LAB_REPO_TOKEN` + GHCR `packages: write` on the repo.
- Freeze the old `blog-site`/`photos`/`rtk-site` repos (archive) only after all four deploy cleanly from the monorepo.

---

## Gotchas already spotted

- **photos has no build/CI today** — it shipped a dev server. Iteration 1 gives it a real standalone build + release workflow for the first time. Test it hardest.
- **Tailwind 3 vs 4** — `rtk` uses Tailwind 4 with `@tailwindcss/postcss`; the others use v3. Keep each app's `tailwind.config` + `postcss.config` local and untouched. No shared Tailwind config in iteration 1.
- **ESLint 8 (eslintrc) vs 9 (flat config)** — same story, keep per-app. A shared config is an iteration-3 job.
- **React 18 vs 19 / Next 13 vs 16** — coexist fine under pnpm isolation; do **not** try to align them now. Alignment is its own iteration.
- **node:25 (rtk) is non-LTS** — standardizing Docker on node:22 LTS is safer and consistent.
- **`.env.local` per app** — keep them per app; they're not shared.
- **`@plaiceholder/next` is in all four** — a natural first candidate for a shared package later, but leave it duplicated for now.
- **`home` (today's `wamphlett`) uses `sharp` + i18n + instrumentation** — heaviest build; verify standalone traces `sharp` correctly. `outputFileTracingRoot` matters here.

---

## Roadmap to shared components (the actual goal)

Iteration 1 gets you a boring, green monorepo. "Edit one component, roll out to all four" then comes in two more steps — and the honest dependency is that shared UI needs a common runtime first.

**Iteration 2 — align versions.** Bring the four apps onto one Next / React / Tailwind major. This is the unglamorous but load-bearing step: you can't cleanly share a React component across React 18 and 19, or a styled component across Tailwind 3 and 4. Likely target: everyone on Next 16 / React 19 / Tailwind 4 (where `rtk` already is). Do it app by app, each behind its own release tag, so a regression only affects one site.

**Iteration 3 — extract shared UI.** With a common runtime in place:
- Create `packages/ui` named `@wamphlett/ui` (and optionally `packages/config` for shared Tailwind/ESLint/TS presets).
- Move a shared component into it; each app adds `"@wamphlett/ui": "workspace:*"` and imports from it.
- Change the component once → Turborepo knows the dependency graph and rebuilds only the apps that use it. One edit, all four sites.

First good candidates to share: the duplicated `@plaiceholder/next` image setup and any header/footer/layout the sites already have in common.

---

## Explicitly out of scope for iteration 1

Shared UI package · dependency/version unification · shared Tailwind/ESLint/TS config · Renovate/dependabot automation · Turborepo remote caching · touching app source code beyond `next.config` + `package.json` scripts/names + Dockerfiles.
