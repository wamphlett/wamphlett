# Monorepo cutover — do these steps on your Mac

The assembled monorepo was built and verified in a sandbox. Because that sandbox can't host a live `.git` directory (a filesystem-permissions quirk) and can't push to GitHub for you, the final steps are yours to run locally, where git works natively. Nothing has touched your GitHub repos yet.

> **Photos = `feed` branch.** The monorepo was built with the photo site's `feed` branch (its latest version, incl. the MUI work), not `master`. Confirmed in the bundle.

## What you've been handed

- **`wamphlett-monorepo.bundle`** — the real deliverable and single source of truth: the complete monorepo as a single-file git bundle, full history of all four sites preserved, photos from `feed` (~109 MB, one-off). Clone it (step 1) to browse or use.
- ⚠️ **`wamphlett-monorepo/`** and **`wamphlett-monorepo-preview/`** — stale sandbox leftovers (the preview still shows the old photos `master`). The sandbox couldn't delete or refresh them. **Delete both** and ignore them:
  ```bash
  rm -rf wamphlett-monorepo wamphlett-monorepo-preview
  ```

## 1. Turn the bundle into a working repo

```bash
cd ~/dev/wamphlett
rm -rf wamphlett-monorepo            # remove the broken partial folder
git clone wamphlett-monorepo.bundle sites   # -> ~/dev/wamphlett/sites, branch master, full history
cd sites
git remote set-url origin git@github.com:wamphlett/wamphlett.git   # clone set origin to the bundle; repoint it
```

(Name the folder whatever you like — `sites` avoids clashing with the existing `wamphlett` homepage checkout.)

## 2. Set up the shared env file

There's **one shared `.env` at the repo root** for local dev/build. Every app's `next.config` loads it, so you set your vars in a single place:

```bash
cp .env.example .env    # then fill in the values
```

`.env.example` lists every env var each app actually references (scanned from the code), grouped by app. The names are distinct across apps, so nothing collides. `.env` is gitignored — never commit real secrets. This file is a **local convenience only**; in Docker/CI/production the vars come from the real environment (k8s / tanka), and the loader is a safe no-op when the file is absent. If you ever need a per-app override, note that the root `.env` takes precedence over an app's own `.env.local` (the root loads first and Next doesn't overwrite already-set vars), so just keep app-specific values in the root file under their own names.

## 3. Verify locally (needs normal internet — the sandbox couldn't fetch Google Fonts)

```bash
pnpm install
pnpm build            # all four should build now that fonts.googleapis.com is reachable
pnpm dev              # brings up home:3001 blog:3002 photos:3003 rtk:3004 in parallel
```

Optionally test a container build (context = repo root):
```bash
docker build -f apps/blog/Dockerfile -t blog-test . && docker run --rm -p 3000:3000 blog-test
```

## 4. Push (this rewrites wamphlett's history — irreversible)

The homepage history now lives under `apps/home`, so this is a force-push. It's your solo repo, but back up the remote first (e.g. `git clone --mirror` the current GitHub repo somewhere) before:

```bash
git push --force origin master
```

## 5. First releases (per-app tags)

```bash
git tag home-v2.0.0   && git push origin home-v2.0.0
git tag blog-v0.3.0   && git push origin blog-v0.3.0
git tag photos-v0.1.0 && git push origin photos-v0.1.0
git tag rtk-v1.1.0    && git push origin rtk-v1.1.0
```

Each tag triggers `release.yml`, which builds only that app and pushes `ghcr.io/wamphlett/<app>:<version>`.

## 6. Your side — the `lab` repo (as agreed, you own this)

The image names changed with the rename, so update `tanka/versions.json` keys **once**:

| old key | new key |
|---|---|
| `ghcr.io/wamphlett/wamphlett` | `ghcr.io/wamphlett/home` |
| `ghcr.io/wamphlett/blog-site` | `ghcr.io/wamphlett/blog` |
| `ghcr.io/wamphlett/rtk-site` | `ghcr.io/wamphlett/rtk` |
| `ghcr.io/wamphlett/photos` | (unchanged) |

Also note:
- Version **values** are `v`-prefixed semver (`v0.3.0`), matching the image tag the workflow pushes and tanka's existing expectation — no change needed on that front.
- `photos` gets CI/deploy for the first time — add its `versions.json` key + tanka wiring if you want it auto-deployed.
- `home` (old `wamphlett`) never bumped lab before; the new `release.yml` now includes an `update-lab` job for **all** apps. If you want to keep home manual, drop it from that job.
- Confirm `LAB_REPO_TOKEN` is present on the `wamphlett` repo (it was there before) and the workflow has `packages: write` (it does).

## 7. After deploys look good

Archive the old `blog-site`, `photos`, and `rtk-site` repos on GitHub (Settings → Archive) so they're read-only history, not live.

## Optional
- Rename the default branch `master` → `main` if you want (`git branch -m master main && git push -u origin main`, then set default on GitHub).
- The `packages/` dir is empty, reserved for iteration 3 (shared UI).
