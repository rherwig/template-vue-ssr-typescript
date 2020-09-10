const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const common = require('./common');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: resolve(common.context, 'src/index.ts'),
    output: {
        filename: 'app.js',
        path: resolve(common.context, 'public'),
        libraryTarget: 'commonjs2',
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: [
        nodeExternals(),
    ],
    resolve: {
        extensions: [ '.js', '.ts' ],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!static', '!static/**/*']
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: resolve(common.context, 'src/server/index.template.html'),
                    to: resolve(common.context, 'public'),
                },
            ],
        }),
    ],
};
