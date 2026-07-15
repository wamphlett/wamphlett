import path from "node:path";
import dotenv from "dotenv";
import withPlaiceholder from "@plaiceholder/next";

import type { NextConfig } from "next";

// shared env: load the monorepo-root .env for local dev/build.
// no-op in Docker/CI (file absent) and never overrides real environment vars.
dotenv.config({ path: path.join(import.meta.dirname, "..", "..", ".env") });

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(import.meta.dirname, "..", ".."),
  // Next 16.2+ requires acknowledging Turbopack when a `webpack` config is
  // present (added by withPlaiceholder to externalize the native sharp
  // binary) — Turbopack ignores it and externalizes sharp on its own.
  turbopack: {},
};

export default withPlaiceholder(nextConfig);
