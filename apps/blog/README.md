# Blog Site

A Next.js blog platform that fetches and renders content from a headless API backend. Deployed at [blog.wamphlett.net](https://blog.wamphlett.net).

## Stack

- **Next.js 13** with TypeScript and the App Router
- **Tailwind CSS** for styling
- **Highlight.js** for code block syntax highlighting (JavaScript, Go)
- **Plaiceholder** for server-side blur image placeholders
- **Docker** for containerised deployment

## Content

Content is not stored in this repo. The site fetches articles and topics from a separate backend API configured via `REACT_APP_API_URL`. Pages are cached for 30 days using Next.js Incremental Static Regeneration (ISR) and can be revalidated on demand via the `/api/revalidate` endpoint.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

By default the app points at the live API. To use a local backend, update `REACT_APP_API_URL` in `.env.local`.

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `REACT_APP_API_URL` | Base URL of the content API | No (defaults to empty string) |
| `REVALIDATE_SECRET` | Secret token for cache revalidation webhook | Yes, for ISR revalidation |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Docker

Build and run with Docker:

```bash
make build
docker run -p 3000:3000 wamphlett-blog
```

## Deployment

Pushing a git tag triggers the GitHub Actions workflow, which builds a Docker image and pushes it to the GitHub Container Registry (`ghcr.io`):

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Cache Revalidation

To invalidate cached pages, call:

```
GET /api/revalidate?secret=<REVALIDATE_SECRET>&path=<path>
```

The backend can use this as a webhook to bust the cache after content changes.
