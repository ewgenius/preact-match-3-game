const config = require('./webpack.config.dev')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: 'build'
})

server.listen(8080, () => {
  
})