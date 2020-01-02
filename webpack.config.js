const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                    }
                }],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            esModule: false
                        },
                    },
                ],
            },
            {
                test: /\.?js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    entry:  path.resolve(__dirname, './src/index.js'), 
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "js/[name].[chunkhash].bundle.js",
        chunkFilename : "js/[name].[chunkhash].bundle.js"
    },
    devServer:{
        port: 1234,
        // contentBase: path.join(__dirname, 'dist'),
        writeToDisk: false,
        hot: false
    },
    optimization: {
        minimizer: [ new OptimizeCSSAssetsPlugin({})],
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                // commons: {
                //     test: /[\\/]node_modules[\\/]/,
                //     name: 'common',
                //     chunks: 'all',
                // },
                vendor: {
                    // name: 'commons',
                    // chunks: 'initial',
                    // minChunks: 2
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                    // get the name. E.g. node_modules/packageName/not/this/part.js
                    // or node_modules/packageName
                    const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
        
                    // npm package names are URL-safe, but some servers don't like @ symbols
                    return `npm.${packageName.replace('@', '')}`;
                    },
                    chunks: 'all',
                },
            }
          
        }
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        }),
        new  MiniCssExtractPlugin({
           filename: "css/[name].css",
           chunkFilename: "css/[id].css"
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.npm_config_report ? 'server': 'disabled'
        }),
    ]
}