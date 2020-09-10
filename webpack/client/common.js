const { merge } = require('webpack-merge');
const VueSsrClientPlugin = require('vue-server-renderer/client-plugin');
const { resolve } = require('path');

const common = require('../common');

const config = merge(common.config, {
    entry: resolve(common.context, 'src/client/index'),
    output: {
        filename: 'client.js',
    },
    plugins: [
        new VueSsrClientPlugin(),
    ],
});

module.exports = {
    config,
};
