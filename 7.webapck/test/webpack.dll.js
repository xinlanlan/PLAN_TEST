let webpack = require('webpack')
let path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        react: ['react', 'react-dom']
    },
    output: {
        library: '[name]',
        filename: '[name].dll.js'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: path.resolve(__dirname, 'dist', '[name].manifest.json')
        })
    ]
}