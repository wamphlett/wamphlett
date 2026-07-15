import withPlaiceholder from "@plaiceholder/next";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  "experimental": { turbopackUseSystemTlsCerts: true },
};

export default withPlaiceholder(nextConfig);
