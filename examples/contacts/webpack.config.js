/* eslint-disable */
'use strict';

var webpack = require('webpack')
var path = require('path')

var libPath = path.resolve(path.join(__dirname + '../../../src/domain-model'))

var env = process.env.NODE_ENV
var config = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'Domain Model',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ],
  resolve: {
    alias: {
      "domain-model": libPath
    }
  }
};

module.exports = config
