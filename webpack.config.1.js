const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs')

const PATHS = {
  "src": path.resolve(__dirname, 'src'),
  "dist": path.resolve(__dirname, 'dist'),
}

module.exports = {
  entry: [
    path.join(PATHS.src, 'js/index.js'),
    path.join(PATHS.src, 'scss/style.scss'),
  ],
  output: {
    filename: './js/bundle.js'
  },
  devtool: "source-map",
  module: {
    rules: [{
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: false
              }],
            ],
            plugins: ['@babel/plugin-proposal-class-properties'],
          }
        }
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: () => [
                require('cssnano')({
                  preset: ['default', {
                    discardComments: {
                      removeAll: true,
                    },
                  }]
                })
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/includes'),
        use: ['raw-loader']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/style.bundle.css"
    }),
    // new CopyWebpackPlugin([{
    //     from: './src/fonts',
    //     to: './fonts'
    //   },
    //   {
    //     from: './src/favicon',
    //     to: './favicon'
    //   },
    //   {
    //     from: './src/img',
    //     to: './img'
    //   },
    //   {
    //     from: './src/uploads',
    //     to: './uploads'
    //   }
    // ]),
    new HtmlWebpackPlugin({
      title: 'Demo page!!!',
      template: path.join('./src/html/views', 'index.html'),
      inject: true
    }),
  ]
};