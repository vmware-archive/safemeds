module.exports = function(env = null) {
  return Object.assign({}, {
    entry: {
      application: './app/components/application.js'
    },
    externals: {
      react: 'React',
      'react/addons': 'React'
    },
    module: {
      loaders: [
        {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
      ]
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      pathinfo: true
    }
  }, env && require(`./webpack/${env}`));
};