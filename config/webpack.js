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
        {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        {test: /\.svg$/, exclude: [/node_modules/], loader: 'svg-loader'}
      ]
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      pathinfo: true
    },
    resolve: {
      alias: {
        tween: 'tween.js'
      }
    }
  }, env && require(`./webpack/${env}`));
};