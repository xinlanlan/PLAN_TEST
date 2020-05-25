const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const PreloadPlugin = require('preload-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = {
  entry: {
    main: resolve('src/main.js')
  },
  // output: {
  //   path: resolve('dist'),
  //   filename: 'js/[name].[hash:8].js',
  //   chunkFilename: 'js/[name].[hash:8].js',
  //   //publicPath: './'
  // },
  resolve: {
    extensions: [".js", ".json", ".vue"],
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      '@': resolve('src')
    }
  },
  stats: {
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    assets: false
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: [
          'cache-loader',   // 缓存
          // 'thread-loader',  多进程打包
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: [resolve('src')],
        use: 'babel-loader'
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: "sass-loader",
            options: {
              implementation: require('dart-sass')
            }
          },
          'postcss-loader',
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"development"',
          BASE_URL: '"/"'
        }
      }
    ),
    new FriendlyErrorsWebpackPlugin(
      {
        additionalTransformers: [
          function () { /* omitted long function */ }
        ],
        additionalFormatters: [
          function () { /* omitted long function */ }
        ]
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'vue-webpack-config',
        filename: 'index.html',
        template: resolve('public/index.html'),
        favicon: resolve('public/favicon.ico'),
        // hash: true
      }
    ),
    // new PreloadPlugin(
    //   {
    //     rel: 'preload',
    //     include: 'initial',
    //     fileBlacklist: [
    //       /\.map$/,
    //       /hot-update\.js$/
    //     ]
    //   }
    // ),
    // new CleanWebpackPlugin(),
    // new webpack.ProgressPlugin(),
    // new CompressionWebpackPlugin() // 开启gzip压缩
  ]
}