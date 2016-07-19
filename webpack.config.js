/* eslint-disable */
'use strict';

var webpack = require('webpack')
var path = require('path')

var env = process.env.NODE_ENV
var config = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'React Django',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
};

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}

module.exports = config

// When inside of repo, prefer src to compiled version.
// You can safely delete these lines in your project.
var modelsSrc = path.join(__dirname, 'src', 'models')
var modelsNodeModules = path.join(__dirname, 'node_modules')
var fs = require('fs')
if (fs.existsSync(modelsSrc) && fs.existsSync(modelsNodeModules)) {
  // Resolve models to source
  module.exports.resolve = { alias: { 'models': modelsSrc } }
  // Compile models from source
  module.exports.module.loaders.push({
    test: /\.js$/,
    loaders: [ 'babel' ],
    include: modelsSrc
  })
}

