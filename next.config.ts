import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { routing } from "./src/i18n/routing";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // LAN testing (e.g. http://192.168.100.145:3000): dev-only assets/HMR
  // reject cross-origin hosts by default, so allow this machine's LAN IP.
  allowedDevOrigins: ["192.168.100.145"],
  experimental: {
    // Required by src/i18n/request.ts (next/root-params). Do not remove.
    rootParams: true,
  },
  async redirects() {
    // ANT-163: /:locale/peridot-id -> /:locale/identity (308 permanent).
    // Edge-level equivalent of the page-level permanentRedirect in
    // [product]/page.tsx (which remains as fallback for alias slugs like
    // /pid). Locales enumerated explicitly so bare /peridot-id still flows
    // through next-intl locale negotiation instead of being pinned to one
    // locale here. `permanent: true` emits 308.
    return routing.locales.map((locale) => ({
      source: `/${locale}/peridot-id`,
      destination: `/${locale}/identity`,
      permanent: true,
    }));
  },
};

export default withNextIntl(nextConfig);
