const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const isProduction = require('webpack-mode');
const pkg = require('./package.json');

const libraryName = pkg.name;

const PATHS = {
  "src": path.resolve(__dirname, 'src'),
  "dist": path.resolve(__dirname, 'dist'),
  "test": path.resolve(__dirname, 'test'),
}

module.exports = {
  entry: [
    path.join(PATHS.src, 'js', 'index.js'),
    path.join(PATHS.src, 'scss', 'style.scss'),
  ],
  output: {
    filename: 'plugin.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    library: libraryName,
  },
  devtool: "source-map",
  module: {
    rules: [{
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-proposal-class-properties'],
          }
        }
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: [
          {
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
                require('autoprefixer'),
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
    new CleanWebpackPlugin(PATHS.dist, {}),
    new MiniCssExtractPlugin({
      filename: "./css/style.bundle.css"
    }),
    new HtmlWebpackPlugin({
      title: 'Demo page!!!',
      template: path.join(PATHS.test, 'index.html'),
      inject: true
    }),
  ],
  devServer: {
    watchOptions: {
      ignored: ['node_modules'],
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    alias: {
      Plugin: path.join(PATHS.src, 'js'),
    }
  }
};