# Shared UI Extraction Candidates

Follow-up to the `Header` extraction (now living in `packages/ui/src/Header`). This surveys the rest of `apps/{blog,home,photos,rtk}` for components that are duplicated — or near-duplicated — across sites, and are therefore candidates for `packages/ui`.

Method: diffed the same-named component/CSS file across all four apps' `src/components` and `src/layouts` directories. "Identical" below means a byte-for-byte or near-byte-for-byte `diff`. Component names referenced are the current per-app file names.

---

## How the `Header` extraction did it (the pattern to repeat)

`Header` is the model to copy for everything below:

- The shared component (`packages/ui/src/Header/Header.tsx`) takes **plain data props** (`navLinks`, `socialLinks`, `nameHref`, `scrollIn`, `collapseMenuOnDesktop`, `className`) and a `menuSlot` **render prop** for the one truly app-specific piece (each site's mobile menu trigger).
- Cross-cutting content that's identical across sites but not really "UI" (the social links list) moved to `packages/ui/src/config/socialLinks.ts` as shared config/data, not just a component.
- Each app keeps a thin local wrapper (`apps/*/src/components/header.tsx`) that imports the shared `Header`, pulls its own runtime config (`useRuntimeConfig`), and supplies the props. The wrapper is where app identity lives; the package is where behavior lives.

This gives a template for grading each candidate below: **plain-props extraction**, **render-slot extraction**, or **shared-config extraction** — plus a thin per-app wrapper where any local wiring (routing, runtime config, app-specific icons) is unavoidable.

---

## Tier 1 — extract as-is, little to no config needed

These are identical or near-identical across every app that has them. Highest value, lowest risk.

### `HeaderImage`
`apps/{blog,home,photos,rtk}/src/components/headerimage.tsx` are **byte-for-byte identical** (component logic; only the CSS module differs, see below). Wraps `LazyImage` in an absolutely-positioned, padded container that sits behind the `Header`.

- **Benefits:** zero behavior divergence to reconcile — this is a pure copy-paste cleanup. One bug fix in four places today; one place after.
- **Issues:** its companion CSS (`headerImage.module.css`) sets a fixed `.container` height that currently differs *per app* (blog: `60vh` → `85vh` responsive; home: `100vh` flat; photos: `80vh` → `95vh` on mobile; rtk: `100vh` flat). This needs a `height`/`mobileHeight`-style prop (or a CSS custom property passed via `style`) rather than being baked into the shared module CSS.
- **Path:** move component to `packages/ui`, add a `heightVar`-style prop the module CSS reads via inline custom property (e.g. `style={{ '--header-height': height }}`), let each app pass its own value.

### `AspectRatioBox`
`apps/{blog,home,photos}/src/components/aspectRatioBox.{tsx,jsx}` are identical in behavior (home's is plain JS, blog/photos add TS types — a wash). `rtk` doesn't have one, but nothing prevents it adopting the shared version.

- **Benefits:** trivial, zero-config extraction; also a good first "second" extraction after `Header` to prove the workflow for a component with no app-specific wiring at all.
- **Issues:** none functionally. Only decision is whether to keep it JS-flexible or require `ReactNode` children (recommend: type it, per blog/photos).

### `LazyImage`
`apps/{blog,home,photos,rtk}/src/components/lazyimage.tsx` — near-identical `next/image`-based lazy-load-with-blur-placeholder component. Differences are cosmetic/accidental rather than intentional:
- `photos`/`rtk` throw if `url` is falsy; `blog`/`home` don't.
- `blog`/`home` accept a `sizes` override prop; `photos`/`rtk` hardcode `'100vw'`.
- `home`/`photos`/`rtk` import `path` from `'path'` and never use it (dead import — a Node built-in that shouldn't be importable client-side at all; worth dropping during extraction, not preserving).
- `blog` defaults `blurDataURL` to `''`; others leave it `undefined` and gate rendering on truthiness.

- **Benefits:** consolidates the `imageLoaderBuilder` query-param logic (the `?w=` resizing contract with whatever image host/proxy serves these) into one place — today a change to the resize widths list (`[640, 1080, 1200, 1920, 2048, 3840]`) must happen in four files.
- **Issues:** need to settle the small behavioral deltas (throw-on-missing-url vs. not; `sizes` prop support) as part of extraction — pick the superset (keep the `sizes` prop, keep the guard, drop the dead `path` import) rather than config-flagging them, since none of these looks like an intentional per-site difference.
- **Path:** straightforward extraction once those two deltas are reconciled; no config surface needed beyond existing props.

### `DimmingBackground`
`apps/{home,photos,rtk}/src/components/dimmingBackground.jsx` — scroll-driven background dimmer wrapping page content (not used by `blog`, which uses a sidebar/backdrop model instead — see Tier 2).

- **Benefits:** simple, self-contained, config difference is a single number.
- **Issues:** `home` and `rtk` scale scroll percentage by `* 1.5`; `photos` doesn't. This wants a `scrollMultiplier` (or `intensity`) prop, default `1`.
- **Path:** extract with a `scrollMultiplier = 1` prop; `home`/`rtk` pass `1.5`.

### `FancyMenuIcon`
`apps/{blog,photos}/src/components/fancyMenuIcon.jsx` — identical animated hamburger/close icon (`rtk` has no mobile menu since it has no collapsible nav content; `home` doesn't use it either). Already effectively consumed as a `menuSlot` render-prop child in the `Header` extraction, so this is a natural next piece to move into `packages/ui` so the render-prop content itself isn't duplicated too.

- **Benefits:** completes the `Header` story — right now the *shell* is shared but the two apps that need a menu icon each carry their own identical copy of it.
- **Issues:** none — no config divergence at all.

---

## Tier 2 — extract with config, real but small divergence

### `PrimaryLayout` scroll/shrink chrome
`apps/{blog,home,photos,rtk}/src/layouts/primary.tsx` (plus `apps/photos/src/layouts/overview.tsx`, which repeats the same logic a fifth time). All five copies implement the same "header padding shrinks as you scroll, capped at `maxScroll`" state machine:

```
scrollY / maxScroll → padding 0..defaultPadding
defaultPadding = innerWidth < 768 ? 10 : 24
maxScroll = innerHeight * 0.8   (blog uses * 0.3, and blog also drives a sidebar/backdrop, not DimmingBackground)
```

- **Benefits:** this is the single biggest duplication by line count and by *risk* — five copies of non-trivial `useEffect`/scroll-listener logic that's easy to get subtly wrong (stale closures, missing cleanup, resize races). Extracting to a hook (e.g. `useShrinkOnScroll({ maxScrollFactor, minPadding, maxPadding })`) centralizes that risk instead of multiplying it.
- **Issues:**
  - `blog`'s `maxScroll` factor (`0.3`) and mobile-sidebar/backdrop composition differ meaningfully from the other three's `DimmingBackground` composition — this isn't just a config knob, it's a genuinely different layout shape (sidebar-with-backdrop vs. full-bleed-dimming). Recommend extracting the **scroll math as a hook** shared by all five, and leaving the **JSX composition** (what wraps `Header`/`HeaderImage`/children) per-app for now rather than forcing one `<PrimaryLayout>` component with a growing prop surface.
  - `rtk`'s version swaps `HeaderImage` for `HeaderVideo` — another reason to keep composition local and only share the hook initially.
- **Path (incremental):**
  1. Extract `useShrinkOnScroll` hook to `packages/ui` first (low risk, high value, matches the `useHeaderScroll` hook already proven in the `Header` package).
  2. Once four-to-five call sites use the same hook, revisit whether a `<PrimaryLayout>` wrapper component (config: `variant: 'sidebar' | 'dimming'`, `mediaSlot` for image-vs-video) is worth it, or whether the hook alone captures most of the value. Don't jump straight to the full-component extraction — the JSX shapes really do differ (sidebar+backdrop vs. dimming wrapper vs. video background vs. overview's extra `GalleryTitle`).

### `HeaderVideo` / `HeaderImage` unification
`apps/rtk` has a `HeaderVideo` component (video-background variant of `HeaderImage`, same padding/positioning contract, currently the only "media" variant beyond image).

- **Benefits:** if/when a second app wants a video header, a `HeaderMedia` component with a `kind: 'image' | 'video'` (or simply accepting a `mediaSlot` render prop, consistent with `Header`'s `menuSlot` pattern) avoids fragmenting into `HeaderImage`/`HeaderVideo`/`HeaderWhatever`.
- **Issues:** only one consumer today, so there's no duplication to remove yet — this is a "design for the shape you already see coming" note, not an urgent extraction. Low priority until a second video/alternate-media header appears.

---

## Tier 3 — cross-app duplicates with real content/shape differences

Components that exist in more than one app under the same name, doing the same *job*, but differ enough in content or props that a shared version needs a genuine config surface (not just a constant).

### Image grids (`double`, `row`, `triSquare`, `triWide`, `offset`)
`apps/{home,photos}/src/components/imagegrids/*` — `row.tsx`, `double.tsx`, `triSquare.tsx`, `triWide.tsx` are **identical** between `home` and `photos`. `offset.tsx` differs: `photos`'s version adds a `Type.Default | Type.Tall` enum controlling aspect ratios and an extra CSS variant; `home`'s is the `Default`-only case.

- **Benefits:** four of five grid layouts are already an exact match — this is close to a free extraction, and it's the largest chunk of `photos`-vs-`home` overlap outside of layout chrome. `photos` also has a `imagegridsold/` directory (superseded `double`/`row`) that's dead weight worth deleting rather than migrating — worth flagging to the user rather than silently porting unused code into the shared package.
- **Issues:** `offset` needs the `type` prop (superset of `photos`'s version covers `home`'s usage as the default case) — straightforward, not a real blocker.
- **Path:** extract all five under `packages/ui/src/ImageGrid/*`, using `photos`'s `offset.tsx` (the superset) as the source of truth. Confirm the `imagegridsold` directory in `photos` is genuinely unused before extraction so it isn't accidentally carried forward.

### `AlbumTile` / `More`
`apps/{home,photos}/src/components/albumTile.tsx` and `more.tsx` — same shape, different config:
- `AlbumTile`: `photos` adds an `AlbumTileStyle.Small | Large` enum (controls a CSS variant class and image opacity); `home` only has the `Small` case. Same superset situation as `offset` above.
- `More`: near-identical "see more" tile; only the visible label text differs (`"See more photos"` vs. `"More Albums"`) and the shape of the `Tiles` type (fixed 3-tuple vs. arbitrary array — `photos`'s is the more general version).

- **Benefits:** same reasoning as the image grids — these are part of the same `photos`/`home` album-browsing UI family and were clearly forked from one another, so reconciling them now (while the divergence is still small) is cheaper than doing it later.
- **Issues:** needs a `label` prop for `More`, and adopting `photos`'s `AlbumTileStyle` enum + `AlbumData[]` typing as the shared shape.

### `ImageWithDescription`
`apps/{home,photos}/src/components/imageWithDescription.tsx` — identical except `photos` guards `{title && <span>{title}</span>}` for an optional title, `home` always renders the span. Trivial: extract with `title` as optional and always guard.

### `CircleIconLink`, `TextReel`
`apps/{home,rtk}/src/components/{circleIconLink,textReel}.tsx` — **identical**. Both currently only consumed by each app's `introduction.tsx`.

- **Benefits:** free extraction, no config needed.
- **Issues:** none. Low urgency only because the components are small, but zero cost to move.

### `Introduction`
`apps/{home,rtk}/src/components/introduction.tsx` — **not** a good extraction candidate despite the shared name. The two are almost entirely different content (home: name/role bio + tech-stack `TextReel` + social icons; rtk: a Kanji-study project blurb, no tech reel, no icons). Sharing this would mean a component that's mostly slots with barely any shared layout logic. Recommend leaving as-is; instead extract the *pieces it's built from* (`CircleIconLink`, `TextReel`, above) and let each app keep assembling its own `Introduction`.

---

## Not recommended for extraction

Flagging these explicitly so they're not revisited unnecessarily:

- **`Sidebar`** (`blog` vs. `photos`) — same component name, but genuinely different domains: `blog`'s is a topic/article/recent-posts nav built from CMS data; `photos`'s is a year-grouped album nav built from static entry data. No shared logic beyond "a `<ul>` in a slide-out panel." Not worth forcing a shared abstraction.
- **`Feed`, `Filter`, `Pill`, `DisplayTypeSelector`, `GalleryTitle`, `Youtube`** (`photos`-only) — single-consumer components; nothing to share yet.
- **`PostList`, `PostTile`, `SeriesPill`, `SeriesSection`, `SeriesSteps`, `Breadcrumb`, `Title`, `ArticleFooter`** (`blog`-only) — same, single-consumer.
- **`Frame`, `FrameList`** (`rtk`-only) — same.
- **`svgs.{jsx,tsx}`** per app — these are grab-bags of app-specific icons (different sets, different counts: 32–119 lines each), not one component. `packages/ui/src/icons/` already exists for the genuinely shared ones (the social icons used by `Header`); icons that are one-off illustrations for a single site's content should stay local rather than being forced into the shared registry.

---

## Suggested order of work

1. **`HeaderImage`, `AspectRatioBox`, `FancyMenuIcon`, `CircleIconLink`, `TextReel`** — zero-config or near-zero-config, do these first as low-risk wins that build on the `Header` extraction's momentum.
2. **`LazyImage`, `DimmingBackground`** — small, well-understood config surface (`sizes`/url-guard reconciliation; `scrollMultiplier`).
3. **Image grids + `AlbumTile` + `More`** — bundle together since they're all part of the same `home`/`photos` album UI family and share the "superset prop" pattern.
4. **`useShrinkOnScroll` hook extraction from `PrimaryLayout`** — highest line-count payoff, but do it after 1–3 so the hook can follow the same proven pattern (`useHeaderScroll` already set the precedent) rather than being the first thing attempted.
5. Revisit a unified `PrimaryLayout` component (and `HeaderImage`/`HeaderVideo` unification) only once the above has landed and the remaining duplication is clearly just composition, not logic.
