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
      filename: isDevelopment ? '[name].js' : '[name].[hash].js'
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

      !isDevelopment && new CleanWebpackPlugin()
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
