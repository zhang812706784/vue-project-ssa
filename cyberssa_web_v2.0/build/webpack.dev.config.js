const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

let json_config = require('../config/config');

let mainConfig=json_config.mainConfig;

const resolve = dir => path.join(__dirname, dir);

fs.open('./build/env.js', 'w', function (err, fd) {

    const buf = 'export default "development";';

    fs.write(fd, buf, 0, buf.length, function (err, written, buffer) {
    });
});

if(mainConfig.development){

    fs.open(resolve('../src/router/env.js'), 'w', function (err, fd) {

        const buf = fs.readFileSync(resolve(`../src/router/router-modules/router-${mainConfig.defaultRouter}.js`));

        fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {
        });
    });

}

module.exports = merge(webpackBaseConfig, {
    devtool: 'cheap-module-source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: 'iView admin v' + package.version,
            filename: '../index.html',
            inject: false
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/components/locale-components/iview-admin/main-components/theme-switch/theme'
            },
            {
                from: 'src/components/locale-components/iview-admin/text-editor/tinymce'
            }
        ], {
            ignore: [
                'text-editor.vue'
            ]
        })
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        https: {
            key: fs.readFileSync('./build/cert/server.key'),
            cert: fs.readFileSync('./build/cert/server.crt')
        },
        //https:false,
        host: mainConfig.host,
        port: mainConfig.port,
        stats: {colors: true},
        proxy: mainConfig.proxy
    }
});
