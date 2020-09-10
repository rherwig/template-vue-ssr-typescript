import express, { Application } from 'express';
import { resolve } from 'path';

const configureDevelopment = (app: Application): void => {
    const publicPath = resolve(__dirname, '../../../public');

    app.use('/', express.static(
        resolve(publicPath, 'static'),
    ));
};

const configureProduction = (app: Application): void => {
    app.use('/', express.static(__dirname));
};

/**
 * Registers commonly used express middleware, like cors
 * body-parser and security features via helmet.
 *
 * @param {Application} app
 * @return {Promise<Application>}
 */
export default async (app: Application): Promise<Application> => {
    if (process.env.NODE_ENV === 'development') {
        configureDevelopment(app);
    } else {
        configureProduction(app);
    }

    return app;
};
