const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FontPreloadPlugin = require('webpack-font-preload-plugin');
const webpack = require('webpack');

const SRC_PATH = path.resolve(__dirname, './src');
const PUBLIC_PATH = path.resolve(__dirname, '../public');
const UPLOAD_PATH = path.resolve(__dirname, '../upload');
const DIST_PATH = path.resolve(__dirname, '../dist');

/** @type {import('webpack').Configuration} */
const config = {
  devServer: {
    contentBase: [PUBLIC_PATH, UPLOAD_PATH],
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  devtool: 'source-map',
  entry: {
    main: [
      'core-js',
      'regenerator-runtime/runtime',
      'jquery-binarytransport',
      path.resolve(SRC_PATH, './buildinfo.js'),
      path.resolve(SRC_PATH, './index.jsx'),
    ],
  },
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.css$/i,
        use: [{ loader: MiniCssExtractPlugin.loader }, { loader: 'css-loader' }, { loader: 'postcss-loader' }],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          regExp: /fonts\/(.+)\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          name: 'fonts/[1].[contenthash].[ext]',
          publicPath: '/',
        },
      },
    ],
  },
  output: {
    filename: 'scripts/[name].js',
    path: DIST_PATH,
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      AudioContext: ['standardized-audio-context', 'AudioContext'],
      Buffer: ['buffer', 'Buffer'],
      'window.jQuery': 'jquery',
    }),
    new webpack.EnvironmentPlugin({
      BUILD_DATE: new Date().toISOString(),
      // Heroku では SOURCE_VERSION 環境変数から commit hash を参照できます
      COMMIT_HASH: process.env.SOURCE_VERSION || '',
      NODE_ENV: 'production',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_PATH, './index.html'),
    }),
    new FontPreloadPlugin({
      // HOTFIX: なぜかpublicPathにautoが含まれる
      replaceCallback: ({ indexSource, linksAsString }) => {
        const newLinkAsString = linksAsString.replace(/autofonts/g, 'fonts');
        return indexSource.replace('{{{links}}}', newLinkAsString);
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      path: false,
    },
  },
};

module.exports = config;
