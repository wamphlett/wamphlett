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
  experimental: { turbopackUseSystemTlsCerts: true },
};

export default withPlaiceholder(nextConfig);
