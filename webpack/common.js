const { resolve } = require('path');
const { VueLoaderPlugin } = require('vue-loader');
import Dotenv from 'dotenv-webpack';

const context = resolve(__dirname, '..');

const vueBuild = process.env.NODE_ENV !== 'production'
    ? 'vue.runtime'
    : 'vue.runtime.min';

const config = {
    output: {
        path: resolve(context, 'public'),
        publicPath: '/',
        chunkFilename: '[name].[chunkhash].js',
    },
    resolve: {
        extensions: ['.js', '.ts', '.vue'],
        alias: {
            '@': resolve(context, 'src/shared'),
            'vue$': `vue/dist/${vueBuild}.js`,
        },
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
                        appendTsSuffixTo: ['\\.vue$'],
                    },
                },
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use: 'vue-loader',
            },
        ],
    },
    optimization: {
        noEmitOnErrors: true,
    },
    plugins: [
        new VueLoaderPlugin(),
        new Dotenv(),
    ],
};

module.exports = {
    context,
    config,
};
