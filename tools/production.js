'use strict';

const merge = require('webpack-merge');
const base = require('./base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(base, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: false,
        },
      }),
    ],
  }
});