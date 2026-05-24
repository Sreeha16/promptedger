import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  ...({
    allowedDevOrigins: ["192.168.29.129"]
  } as any)
};

export default nextConfig;