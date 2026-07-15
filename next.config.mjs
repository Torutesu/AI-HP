/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export → deploys to Cloudflare Pages as static assets.
  // The contact/download form endpoints run as Cloudflare Pages Functions
  // (see functions/api/*), not Next.js server routes.
  output: "export",
  images: {
    // Cloudflare Pages serves the exported images directly; disable the
    // Next.js image optimizer (which needs a Node server).
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
