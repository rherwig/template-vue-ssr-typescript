import bodyParser from 'body-parser';
import helmet from 'helmet';
import type { Application, NextFunction, Request, Response } from 'express';

/**
 * Registers commonly used express middleware, like cors
 * body-parser and security features via helmet.
 *
 * @param {Application} app
 * @return {Promise<Application>}
 */
export default async (app: Application): Promise<Application> => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    app.use(helmet({
        contentSecurityPolicy: isDevelopment ? false : undefined,
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false,
    }));

    app.set('trust proxy', 1);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err) {
            console.error('Internal Server Error', err);
            return res.status(500).end();
        }

        return next();
    });

    return app;
};
