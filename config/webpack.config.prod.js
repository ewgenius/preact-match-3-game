const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: [path.resolve('./src/app.tsx')],
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
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
}