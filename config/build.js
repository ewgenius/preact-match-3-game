const config = require('./webpack.config.prod')
const webpack = require('webpack')

const compiler = webpack(config)

compiler.run(() => {
  console.log('done')
})