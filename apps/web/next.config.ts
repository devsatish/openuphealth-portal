import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@openup/types",
    "@openup/validation",
    "@openup/domain",
    "@openup/ui",
    "@openup/config",
    "@openup/api-client",
  ],
  output: "standalone",
};

export default nextConfig;
