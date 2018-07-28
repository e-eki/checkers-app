
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const argv = require('yargs').argv;
const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;

module.exports = {
    //mode: 'development',
    entry: './public/app.js',
    output: {
        path: path.resolve(__dirname, './public'), 
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,  
                loader: "babel-loader",  
                options:{
                    presets:["env", "react"]    
                }
            },
            {
                test: /\.less$/, 
                exclude: /node_modules/,
                //loader: 'style-loader!css-loader!less-loader'
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                      loader: 'css-loader',
                      options: {
                        minimize: isProduction
                      }
                    },
                    'less-loader',
                    //'resolve-url-loader' //??
                  ]
            },
            {
                test: /\.(svg|png|gif|jpg|ico)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        context: 'src/assets',
                        name: 'root[path][name].[ext]'
                    }
                }
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV':  JSON.stringify('production')  //??
            //'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development')  //??
          }),
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css'
        })
    ],
    /*plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
          }),
        new webpack.optimize.UglifyJsPlugin(),
    ],*/
    optimization: isProduction ? {
        minimizer: [
          new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
              compress: {
                inline: false,
                warnings: false,
                drop_console: true,
                unsafe: true
              },
            },
          }),
        ]
    } : {},
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        //port: 9000,
        compress: true,
        open: true
    }
};