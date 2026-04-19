# warrenamphlett.co.uk

Welcome to the repo behind my personal site. This is where I keep a running record of the places I've been and the photos I've taken along the way — a kind of living travel journal that goes back to 2016.

## What it is

A timeline of events and travels, each one having the ability to display a photo grid. There's a private admin panel for managing the content, and the whole thing is built to be fast, clean, and easy to keep up to date.

## Running it locally

You'll need Node.js installed, then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## The admin panel

Events are managed through a password-protected editor at `/config`. To use it locally, create a `.env.local` file in the root:

```
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-password
SESSION_SECRET=a-random-string-at-least-32-characters-long
```

The editor lets you add, reorder, and delete events, build out photo grids, and publish changes — all without touching the code.

## Built with

Next.js · TypeScript · Tailwind CSS

---

Software engineer by day, photographer whenever possible. You can find more of my work at [warrenamphlett.co.uk](https://warrenamphlett.co.uk) or connect with me on [LinkedIn](https://www.linkedin.com/in/warren-amphlett-5bb9b6170/).
