const webpack = require('webpack');
const path = require('path');

const plugins = [];

const config = {
    target: 'node',
    entry: {
        './index': './src/index'
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, './'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            }
        ]
},
    resolve: {
        extensions: ['.js']
    },
    plugins: plugins
};

module.exports = config;
