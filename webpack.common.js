const CopyPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
    target: 'web', 
    entry: {
        "app": './index.ts',
    },
    module: {
        rules: [
            {
                test: /(\.css|.scss)$/,
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    },
                    {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(ts|tsx)?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: "raw-loader"
              }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', ".tsx"]
    },
    output: {
        path: undefined,
        publicPath: "/",
        filename: '[name].[contenthash].js',
        chunkFilename: "[name].chunk.js",
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            hash: true, // This is useful for cache busting
            filename: 'index.html'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './images',
                    to: 'images'
                },
            ],
        })
    ]
}