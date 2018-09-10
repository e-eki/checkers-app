
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    //mode: 'development',
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, './public'), 
        filename: 'bundle.js'
    },
    // подключение сорсмэпс - для отладки
    devtool: (NODE_ENV !== 'development') ? "cheap-inline-module-source-map" : false,
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,  
                loader: "babel-loader",  
            },
            {
                test: /\.less$/, 
                exclude: /node_modules/,
                //loader: 'style-loader!css-loader!less-loader'
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers:['ie >= 8', 'last 4 version']
                                })
                            ]
                        }
                    },
                    'less-loader',
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
            NODE_ENV: JSON.stringify(NODE_ENV)  
        })
    ],
    optimization: (NODE_ENV !== 'development') ? {
        minimizer: [
          new UglifyJsPlugin({
            //sourceMap: true,
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