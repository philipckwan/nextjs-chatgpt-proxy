/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: function (config, options) {
      config.experiments = { asyncWebAssembly: true, layers: true,};
      return config;
  },
  env: {
    ENV_SOURCE: process.env.ENV_SOURCE,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://${process.env.CONFIG_SERVER_URL}/:path*`,
      },
    ]
  },
}