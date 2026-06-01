/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Security headers for the public landing page
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            // Next.js 15 + React 18 does not require 'unsafe-eval'. If a hard
            // refresh on a fresh production deploy shows blocked scripts in
            // the browser console, verify the bundle was built with
            // `next build` (not `next dev`) before reintroducing 'unsafe-eval'.
            // 'unsafe-inline' on script-src remains for Next.js's inline
            // bootstrap script; prefer a nonce-based fallback when a CSP
            // refactor lands.
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://eu-assets.i.posthog.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.beehiiv.com https://eu.i.posthog.com https://eu-assets.i.posthog.com https://www.facebook.com; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
