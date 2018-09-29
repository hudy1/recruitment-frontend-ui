var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    output: {
        filename: 'bundle.min.js',
        libraryTarget: 'var',
        library: 'entryPoint',
        path: __dirname + '/src/js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true
        })
    ]
};