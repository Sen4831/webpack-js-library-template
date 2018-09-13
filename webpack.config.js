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
}

module.exports = {
  entry: [
    path.join(PATHS.src, 'js', 'index.js'),
    path.join(PATHS.src, 'assets/scss', 'style.scss'),
  ],
  output: {
    filename: 'plugin.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    library: libraryName,
  },
  devtool: isProduction ? false : "source-map",
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
        include: path.resolve(PATHS.src, 'assets/scss'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: isProduction ? false : true,
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
              sourceMap: isProduction ? false : true,
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        options: {
          bypassOnDebug: true,
          mozjpeg: {
            progressive: true,
            quality: 65
          },
          // optipng.enabled: false will disable optipng
          optipng: {
            enabled: false,
          },
          pngquant: {
            quality: '65-90',
            speed: 4
          },
          gifsicle: {
            interlaced: false,
          },
          // the webp option will enable WEBP
          webp: {
            quality: 75
          }
        }
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(PATHS.dist, {}),
    new MiniCssExtractPlugin({
      filename: "./assets/css/style.bundle.css"
    }),
    new HtmlWebpackPlugin({
      title: 'Demo page!!!',
      template: path.join(PATHS.src, 'demo.html'),
      filename: 'demo.html',
      inject: true
    }),
  ],
  devServer: {
    watchOptions: {
      ignored: ['node_modules'],
      aggregateTimeout: 300,
      poll: 1000,
    },
    open: true,
    openPage: 'demo.html',
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    alias: {
      Plugin: path.join(PATHS.src, 'js'),
    }
  }
};