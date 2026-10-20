import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // LAN testing (e.g. http://192.168.100.145:3000): dev-only assets/HMR
  // reject cross-origin hosts by default, so allow this machine's LAN IP.
  allowedDevOrigins: ["192.168.100.145"],
  experimental: {
    // Required by src/i18n/request.ts (next/root-params). Do not remove.
    rootParams: true,
  },
};

export default withNextIntl(nextConfig);
