/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['dog.ceo', 'images.dog.ceo', 'emojipedia.org', 'external-content.duckduckgo.com'],
  },
}

module.exports = nextConfig
