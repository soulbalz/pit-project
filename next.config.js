module.exports = {
  experimental: {
    outputStandalone: true
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(new webpack.ProvidePlugin({
      'window.Quill': 'quill'
    }));
    return config;
  }
};
