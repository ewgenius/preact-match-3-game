const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: [
      require.resolve('react-dev-utils/webpackHotDevClient'),
      require.resolve('./polyfills'),
      path.resolve('./src/app.tsx')
    ],
  },
  output: {
    path: path.resolve('./build'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.jsx', '']
  },
  module: {
    loaders: [{
      test: /\.(ts|tsx)$/,
      loader: 'ts'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    })
  ]
}