let path = require('path')
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
        contentBase: './dist'
    },
    output: {
        filename: '[name].[contentHash:8].js',
        path: path.resolve(__dirname, './dist')
    },
    externals: {
        '$': 'jquery'
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
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns:['**/*']
        }),
        ...htmlPlugins
    ]
}