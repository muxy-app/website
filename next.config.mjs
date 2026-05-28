/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow the headless screenshotter (and you) to hit the dev server via 127.0.0.1.
  // Next 16 blocks cross-origin dev resources by default.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
