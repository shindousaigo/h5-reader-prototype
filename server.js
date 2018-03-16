'use strict'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack/dev.config')

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  inline: true
  // hot: true,
  // historyApiFallback: true,
  // overlay: true,
  // stats: { colors: true }
}).listen(3000, (err) => {
  if (err) {
    return console.log(err)
  }
})


var expressServer = require('./express')
expressServer.setup() 


