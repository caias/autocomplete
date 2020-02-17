'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');

module.exports = {
  entry: {
    otom: resolve(__dirname, '..', 'src', 'index.js'),
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'Otom',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      // js - es5 to es3
      {
        test: /\.js$/,
        enforce: 'post',
        loader: 'es3ify-loader',
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              runtime: 'handlebars/runtime',
              helperDirs: [],
              partialDirs: [
                resolve(__dirname, '..', 'src', 'templates', 'partials'),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};