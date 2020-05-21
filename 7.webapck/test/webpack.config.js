let path = require('path')
let webpack = require('webpack')
let HtmlWebpackPlugin = require('html-webpack-plugin');
let { CleanWebpackPlugin } = require('clean-webpack-plugin')

let htmlPlugins = [
    'index',
    'other'
].map(chunkName => {
    return new HtmlWebpackPlugin({
        filename: `${chunkName}.html`,
        chunks: [chunkName]
    })
})

module.exports = {
    entry: {
        index: path.resolve(__dirname, './src/index.js'),
        other: path.resolve(__dirname, './src/other.js')
    },
    mode: "development",
    devServer: {
        port: 3000,
        contentBase: './dist',
        hot: true
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            //... 可配置多个
        },
        extensions: ['.js','.css']  // 文件后缀查找顺序
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader', 
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    'postcss-loader'
                ]
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin({
        //     cleanOnceBeforeBuildPatterns:['**/*']
        // }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, 'dist', 'react.manifest.json')
        }),
        ...htmlPlugins,
    ]
}