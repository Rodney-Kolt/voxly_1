/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // NOTE: Cloudflare Pages can serve Next.js apps without 'output: export'
  // It uses a serverless/edge runtime environment
  // Dynamic routes like /poll/[pollId] work fine without pre-rendering
}

module.exports = nextConfig
