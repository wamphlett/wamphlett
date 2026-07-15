import path from "node:path";
import withPlaiceholder from "@plaiceholder/next";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // trace deps from the monorepo root so standalone output is complete
  outputFileTracingRoot: path.join(import.meta.dirname, "..", ".."),
  experimental: { turbopackUseSystemTlsCerts: true },
};

export default withPlaiceholder(nextConfig);
