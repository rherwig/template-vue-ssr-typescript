import { resolve } from 'path';
import { Application, RequestHandler } from 'express';

import createVueBundleMiddleware from '../plugins/bundle-middleware';
import clientConfig from '../../../webpack/client/development';
import serverConfig from '../../../webpack/server/development';

const createDevelopmentMiddleware = (app: Application): RequestHandler => {
    const templatePath = resolve(__dirname, '../../server/index.template.html');

    return createVueBundleMiddleware(app, {
        clientConfig,
        serverConfig,
        templatePath,
    });
};

const createProductionMiddleware = (app: Application): RequestHandler => {
    const serverBundlePath = resolve(__dirname, 'vue-ssr-server-bundle.json');
    const clientManifestPath = resolve(__dirname, 'vue-ssr-client-manifest.json');
    const templatePath = resolve(__dirname, 'index.template.html');

    return createVueBundleMiddleware(app, {
        serverBundlePath,
        clientManifestPath,
        templatePath,
    });
};

/**
 * Registers webpack and its middleware for development.
 *
 * @param {Application} app
 * @return {Promise<Application>}
 */
export default async (app: Application): Promise<Application> => {
    const vueBundleMiddleware = process.env.NODE_ENV === 'development'
        ? createDevelopmentMiddleware(app)
        : createProductionMiddleware(app);

    app.use(vueBundleMiddleware);

    return app;
};
