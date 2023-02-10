/** @type {import('next').NextConfig} */
let ApiKey = process.env.API_KEY;

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/cdn/upload',
        destination: `https://cdn.sserve.work/upload?api_key=${ApiKey}`
      }
    ]
  }
}

module.exports = nextConfig
