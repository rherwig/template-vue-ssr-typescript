const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./common');

module.exports = merge(common.config, {
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false,
                            modules: {
                                exportOnlyLocals: true,
                            },
                        },
                    },
                    'sass-loader',
                    'postcss-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
    ],
});
