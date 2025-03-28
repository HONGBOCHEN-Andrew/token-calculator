/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      syncWebAssembly: true,
    }
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    })
    return config
  },
}

module.exports = config 