# Merging four Next.js sites into a monorepo — build notes

Running notes for a future blog post. Chronological, with the reasoning, the commands that actually worked, and the things that bit me. Written as I went, so it's honest about the order of discovery.

## The setup (before)

Four separate Next.js sites, four separate GitHub repos, four separate CI pipelines:

| Repo | Next | React | Tailwind | ESLint | Docker base | CI |
|------|------|-------|----------|--------|-------------|----|
| `wamphlett` (homepage) | 13.5 | 18 | 3 | 8 | node:20 | tag `*` |
| `blog-site` | 15.5 | 18 | 3 | 8 | node:22 | tag `v*` |
| `photos` | 13.5 | 18 | 3 | 8 | node:18 | none |
| `rtk-site` | 16.1 | 19 | 4 | 9 | node:25 | tag `v*` |

They'd drifted badly — every combination of Next 13/15/16, React 18/19, Tailwind 3/4. Keeping shared bits in sync meant copy-pasting across four repos. The pain that triggered this: wanting to change one component and have it land everywhere.

Deploy flow (shared): push a git tag → GitHub Actions builds `ghcr.io/wamphlett/<repo>:<tag>` → pushes to GHCR → a bot commits the new tag into `tanka/versions.json` in a separate `lab` repo → GitOps (Tanka/Jsonnet) rolls it out. `photos` had no CI at all; the homepage skipped the lab bump.

## The decisions

- **pnpm workspaces + Turborepo** (not Nx). Four independent apps, no shared code yet — Turborepo is just a cached task runner, minimal config. Nx's power (generators, graph, plugins) is overhead until there are many shared libraries.
- **pnpm's isolated `node_modules`** is the thing that lets the divergent majors coexist safely — each app resolves its own Next/React/Tailwind.
- **The existing `wamphlett` repo becomes the monorepo.** It was already the primary repo; its homepage moves into `apps/home` and the other three merge in around it. One repo to rule them all.
- **`apps/` not `sites/`.** Monorepo convention: `apps/` = anything deployable, `packages/` = shared code. Not literally "applications."
- **Naming, no stutter:** `apps/home`, `apps/blog`, `apps/photos`, `apps/rtk`, with `@wamphlett/*` package names.
- **Versioning = per-app git tags** like `blog-v0.3.0`. Workflow parses the prefix and builds only that app. Keeps the existing tag-based muscle memory; no monorepo-wide version.
- **First iteration deliberately does NOT touch shared UI or align versions.** Just get four apps building and publishing from one repo. Shared components come after a version-alignment pass, because you can't share React components across React 18/19 or Tailwind 3/4.

## The migration log

_(filled in as the work happened — see below)_

### 0. Tooling
- `git-filter-repo` (via pip) for rewriting history into subdirectories.
- `pnpm@9`, Turborepo `^2`.
- All four repos' default branch was `master` (not `main`) — mattered for the merge commands.
- Did everything on **local clones** of the repos so the originals were never at risk; the GitHub-side force-push is a deliberate, separate, human step at the end.

### 1. Reshaping the primary repo + merging the rest
The existing `wamphlett` repo *is* the monorepo, so its own history got rewritten so the homepage lives under `apps/home`:
```
git filter-repo --to-subdirectory-filter apps/home --force   # 51 commits, rewritten in place
```
Then each other site was rewritten into its folder and merged in with unrelated histories:
```
# per site, on a local clone:
git filter-repo --to-subdirectory-filter apps/blog --force
# then, in the monorepo:
git remote add blog <clone>; git fetch blog
git merge --allow-unrelated-histories --no-edit blog/master
```
Result: one repo, ~125 commits, every site's history and `git blame` preserved under its new path.

**Gotcha #1 — git identity.** The merge commits failed the first time with "Committer identity unknown"; `filter-repo` doesn't need it but `git merge` does. Set `user.name`/`user.email` before merging.

**Gotcha #2 — branch names.** Everything was on `master`, so the merge refs were `<remote>/master`, not `main`. Easy to assume `main` and get "couldn't find remote ref".

### 2. Naming + config
- Folders `apps/{home,blog,photos,rtk}`, packages `@wamphlett/{home,blog,photos,rtk}`.
- Per-app unique dev ports (3001–3004) so `turbo run dev` runs all four at once without port clashes.
- Deleted the four `package-lock.json` files; a single `pnpm-lock.yaml` replaces them. `pnpm install` resolved 792 packages, only cosmetic peer warnings.
- Removed the now-inactive nested `.github/workflows` that got dragged in under each `apps/*` (GitHub only runs workflows at the repo root).

### 3. Standalone output in a monorepo — the fiddly bit
Each app needs `output: 'standalone'` **and** `outputFileTracingRoot` pointed at the monorepo root, or the standalone bundle misses workspace-hoisted deps. Where that key lives differs by Next major:
- Next 13 (`home`, `photos`): `experimental.outputFileTracingRoot`
- Next 15 (`blog`) / Next 16 (`rtk`): top-level `outputFileTracingRoot`

Set it with `path.join(import.meta.dirname, '..', '..')`. Verified the resulting layout is `apps/<app>/.next/standalone/apps/<app>/server.js` with a traced `node_modules` alongside — which is exactly what the Dockerfiles copy.

### 4. Docker — Turborepo `prune`
Replaced four ad-hoc Dockerfiles (node 18/20/22/25, one that didn't even build) with one standard multi-stage pattern per app: `turbo prune @wamphlett/<app> --docker` → `pnpm install --frozen-lockfile` on the pruned lockfile → `turbo build --filter` → copy the Next standalone output into a slim `node:22-alpine` runner. Build context is the **repo root**, not the app dir.

### 5. Versioning + release
Per-app tags `<app>-v<semver>`; one `release.yml` parses the prefix, builds only that app, pushes `ghcr.io/wamphlett/<app>:<version>`. Used `github.repository_owner` (not `github.repository`) for the image name so it stays `ghcr.io/wamphlett/<app>` rather than picking up the repo path — keeps the deploy keys sane.

### 6. Verification, and the sandbox's limits
- `pnpm install` + workspace resolution + the turbo task graph: all verified working.
- Full `next build` of the real apps couldn't finish **in the sandbox** — Next fetches Google Fonts (`next/font/google`) at build time and only the npm registry was reachable. Not a monorepo problem; it builds fine with normal internet. Proved the standalone mechanics separately with a throwaway no-fonts probe app.

**Gotcha #3 — the mounted filesystem can't do git.** All the git work had to happen in the sandbox's native fs; running `filter-repo`/`clone` directly against the mounted project folder failed with "Operation not permitted" on lock files. Delivery back to the Mac is via a `git bundle` (single file), not a live `.git` dir.

### 7. Correction — the photo site's real branch
After the first assembly, spotted that the photo site's latest work lived on a `feed` branch, not `master` (master was 2 commits, `feed` was 8, and `feed` adds a MUI-based UI). Rebuilt the monorepo using `photos@feed` — same Next 13 / React 18 majors, so it slotted in identically, and `feed` already had `output: standalone`. Cheap to redo because the whole assembly is a script. Lesson for the post: **confirm which branch is "current" for every repo before merging** — the default branch isn't always the latest.

### Blog-post angles worth keeping
- "Four Next.js versions in one repo and nobody got hurt" — pnpm isolated linker as the enabling trick.
- The unglamorous truth: the merge is the easy 20%; the real goal (shared components) is gated on a boring version-alignment pass you have to do first.
- `outputFileTracingRoot` is the one line everyone forgets, and standalone Docker images silently 500 without it.
- Preserving history across a repo merge with `filter-repo` + `--allow-unrelated-histories`, and why `master` vs `main` and git identity bite you mid-merge.
