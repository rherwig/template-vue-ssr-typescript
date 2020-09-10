const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSsrServerPlugin = require('vue-server-renderer/server-plugin');
const { resolve } = require('path');

const common = require('../common');

const config = merge(common.config, {
    entry: resolve(common.context, 'src/server/index'),
    target: 'node',
    externals: [
        nodeExternals({
            allowlist: /\.css$/,
        }),
    ],
    output: {
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    plugins: [
        new VueSsrServerPlugin(),
    ],
});

module.exports = {
    config,
};
