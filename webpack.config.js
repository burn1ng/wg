const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const JsLoader = require('./webpack/JsLoader');
const TemplateLoader = require('./webpack/TemplateLoader');
const css_loaders = require('./webpack/css_loaders');
const url_loader = require('./webpack/url_loader');
const SvgLoader = require('./webpack/SvgLoader');

const is_dev_mode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        open: true,
        hot: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: is_dev_mode ? '[name].css' : '[name].[hash].css',
            chunkFilename: is_dev_mode ? '[id].css' : '[id].[hash].css',
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.ProvidePlugin({
            _: 'lodash-es'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            JsLoader,
            css_loaders({is_dev_mode}),
            url_loader({is_dev_mode}),
            SvgLoader,
            TemplateLoader
        ],
    },
    resolve: {
        modules: [
            path.resolve('src'),
            path.resolve('node_modules')
        ]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};