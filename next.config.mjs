/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Next 15 streams <title>/<meta>/<link rel=canonical> into the <body> on
  // dynamic routes unless the user agent matches this list. The default list
  // covers social previews and a few search engines, but NOT the AI crawlers
  // (GPTBot, ClaudeBot, PerplexityBot…) that do not execute JS and read the
  // <head> only. Extending it keeps title, canonical and hreflang in <head>
  // for every crawler we want to be cited by. Default list kept verbatim.
  htmlLimitedBots:
    /[\w-]+-Google|Google-[\w-]+|Googlebot|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|Google-Extended|cohere-ai|CCBot|Bytespider|Amazonbot|meta-externalagent|MistralAI-User|DuckAssistBot|YouBot|PetalBot|SemrushBot|AhrefsBot|MJ12bot|Screaming Frog|MargotSEOCheck/i,

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
            // GA4 (gtag.js + collect beacons) and Google Ads conversion signals
            // need googletagmanager.com / google-analytics.com / google.com /
            // doubleclick whitelisted, or Consent Mode + GA4 are silently blocked.
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://eu-assets.i.posthog.com https://connect.facebook.net https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://api.beehiiv.com https://eu.i.posthog.com https://eu-assets.i.posthog.com https://www.facebook.com https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://www.google.com https://googleads.g.doubleclick.net; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
