const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')

function resolve(dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = merge(base, {
  mode: "development",
  output: {
    path: resolve('dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    publicPath: '/'
  },
  devtool: '#cheap-module-eval-source-map',
  devServer: { 
    host: "0.0.0.0", 
    port: 3000,
    hot: true,
    clientLogLevel: 'none',
    open: false,
    historyApiFallback: true,
    contentBase: resolve('dist'),
    //stats: "errors-only", 
    overlay: {
      warnings: true,
      errors: true
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NamedChunksPlugin() // 使用此插件热更新时控制台会显示模块的相对路径
  ]
})