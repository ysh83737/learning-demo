const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
    mode: 'development',
    entry: {
        index: __dirname + '/js/index.js'
    },
    output: {
        path: __dirname + '/build',
        filename: '[name]_[hash].js'
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['> 1%', 'last 2 versions']
                                }
                            }]
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties"
                        ]
                    }
                },
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    devServer: {
        host: 'localhost',
        port: 8088,
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({template: './index.html'}),
        new ExtractTextPlugin('style_[hash].css'),
        new CleanWebpackPlugin(['build/*.*'])
    ]
};

module.exports = config;