const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ProvidePlugin } = require('webpack');

module.exports = ({ mode } = { mode: 'production' }) => {
  console.log(`mode is: ${mode}`);
  const isDevelopment = mode !== 'production';

  return {
    mode,
    entry: './src/index',

    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'build'),
      filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
      chunkFilename: isDevelopment
        ? '[name].chunk.js'
        : '[name].[contenthash:8].chunk.js'
    },

    module: {
      rules: [
        {
          test: /\.jpe?g|png$/,
          exclude: /node_modules/,
          use: ['url-loader', 'file-loader']
        },
        {
          test: /\.(t|j)sx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.module\.s(a|c)ss$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: isDevelopment
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevelopment
              }
            }
          ]
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: /\.module.(s(a|c)ss)$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevelopment
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),

      new ProvidePlugin({
        React: 'react'
      }),

      !isDevelopment && new CleanWebpackPlugin(),

      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].[contenthash:8].css',
        chunkFilename: isDevelopment ? '[id].css' : '[id].[contenthash:8].css'
      })
    ].filter(Boolean),

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },

    devServer: {
      open: true,
      port: 3000
    }
  };
};
