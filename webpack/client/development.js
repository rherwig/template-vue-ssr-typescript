const webpack = require('webpack');
const { merge } = require('webpack-merge');

const common = require('./common');

module.exports = merge(common.config, {
    mode: 'development',
    devtool: 'cheap-eval-module-source-map',
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false,
                            importLoaders: 1,
                        },
                    },
                    'sass-loader',
                    'postcss-loader',
                ],
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
});
