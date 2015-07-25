var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: [
    path.resolve(__dirname, 'src/index.js')
  ],

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "index.js",
    library: "topick",
    libraryTarget: "commonjs2"
  },

  externals: {
    "nlp_compromise": "nlp_compromise",
    "superagent-bluebird-promise": "superagent-bluebird-promise",
    "htmlparser2": "htmlparser2",
    "text-miner": "text-miner"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src')
      }
    ]
  }
}