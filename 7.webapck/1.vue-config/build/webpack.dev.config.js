const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')

function resolve(dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = merge(base, {
  mode: "development",
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 3000,
    progress: false,
    hot: true,
    open: false,
    historyApiFallback: true,
    contentBase: resolve('dist'),
    stats: "errors-only", 
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