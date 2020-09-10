import { join } from 'path';
import { readFileSync } from 'fs';
import MemoryFs from 'memory-fs';
import chokidar from 'chokidar';
import { createBundleRenderer } from 'vue-server-renderer';
import express, { Application, Request, Response, RequestHandler } from 'express';
import webpack, { Configuration, Stats } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

interface IDevelopmentOptions {
    clientConfig: Configuration;
    serverConfig: Configuration;
    templatePath: string;
}

interface IProductionOptions {
    serverBundlePath: string;
    clientManifestPath: string;
    templatePath: string;
}

export interface VueAppContext {
    rendered?: () => void;
    state?: Record<any, any>;
    isServer: boolean;
    req: Request;
}

class BundleCache {
    private bundle: Record<string, unknown>;
    private template: string | undefined;
    private clientManifest: Record<string, unknown> | undefined;

    constructor() {
        this.bundle = {};
        this.template = undefined;
        this.clientManifest = undefined;
    }

    public getBundle(): Record<string, unknown> {
        return this.bundle;
    }

    public setBundle(bundle: string): void {
        this.bundle = JSON.parse(bundle);
    }

    public getTemplate(): string | undefined {
        return this.template;
    }

    public setTemplate(template: string): void {
        this.template = template;
    }

    public getClientManifest(): Record<string, unknown> | undefined {
        return this.clientManifest;
    }

    public setClientManifest(clientManifest: string): void {
        this.clientManifest = JSON.parse(clientManifest);
    }
}

const _cache = new BundleCache();

/**
 * Creates express middleware for development environment only.
 * This middleware creates the webpack client and server bundle
 * and updates them.
 *
 * @param app Express app
 * @param clientConfig Webpack client configuration
 * @param serverConfig Webpack server configuration
 * @param templatePath Html template path
 * @returns {Function} Express middleware
 */
const createDevMiddleware = (app: Application, {
    clientConfig,
    serverConfig,
    templatePath,
}: IDevelopmentOptions): RequestHandler => {
    if (!clientConfig.output) {
        throw new Error('Client configuration does not contain `output`.');
    }

    const { publicPath, path } = clientConfig.output;
    if (!publicPath || !path) {
        throw new Error('`path` and `publicPath` must be defined in `output`.');
    }
    const clientCompiler = webpack(clientConfig);
    const devMiddleware = webpackDevMiddleware(clientCompiler, {
        publicPath,
        watchOptions: {
            poll: 100,
        },
    });
    const hotMiddleware = webpackHotMiddleware(clientCompiler, {
        heartbeat: 5000,
    });

    app.use(devMiddleware);
    app.use(hotMiddleware);
    app.use(publicPath, express.static(path));

    clientCompiler.hooks.done.tap('VueBundleMiddleware', (stats: Stats) => {
        const _stats = stats.toJson();

        _stats.errors.forEach(console.error.bind(console));
        _stats.warnings.forEach(console.warn.bind(console));

        if (_stats.errors.length) {
            return;
        }

        const clientManifest = devMiddleware.fileSystem.readFileSync(
            join(path, 'vue-ssr-client-manifest.json'),
            'utf-8',
        );

        _cache.setClientManifest(clientManifest);
    });

    if (templatePath) {
        _cache.setTemplate(readFileSync(templatePath, 'utf-8'));
        chokidar.watch(templatePath, {
            usePolling: true,
            awaitWriteFinish: {
                pollInterval: 100,
                stabilityThreshold: 500,
            },
        }).on('change', () => {
            _cache.setTemplate(readFileSync(templatePath, 'utf-8'));
        });
    }

    const serverCompiler = webpack(serverConfig);
    const mfs = new MemoryFs();

    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({
        poll: 100,
    }, (err: Error, stats: Stats) => {
        if (err) {
            throw err;
        }

        if (stats.toJson().errors.length) {
            return;
        }

        _cache.setBundle(mfs.readFileSync(
            join(path, 'vue-ssr-server-bundle.json'),
            'utf-8',
        ));
    });

    return (req: Request, res: Response): void => {
        const renderer = createBundleRenderer(_cache.getBundle(), {
            runInNewContext: false,
            clientManifest: _cache.getClientManifest(),
            template: _cache.getTemplate(),
        });
        const context: VueAppContext = {
            isServer: true,
            req,
        };

        renderer.renderToString(context, (err, html) => {
            if (err) {
                console.error(err);
                return res.status(500).end(err.message);
            }

            return res.header('Content-type', 'text/html').end(html);
        });
    };
};

/**
 * Creates an express middleware rendering the VueJS bundle.
 *
 * @returns {Function} Express middleware
 */
const createMiddleware = ({
    serverBundlePath,
    clientManifestPath,
    templatePath,
}: IProductionOptions): RequestHandler => {
    const serverBundle = JSON.parse(
        readFileSync(serverBundlePath, 'utf-8'),
    );
    const clientManifest = JSON.parse(
        readFileSync(clientManifestPath, 'utf-8'),
    );
    const template = readFileSync(templatePath, 'utf-8');

    const renderer = createBundleRenderer(serverBundle, {
        runInNewContext: false,
        clientManifest,
        template,
    });

    return (req: Request, res: Response): void => {
        const context: VueAppContext = {
            isServer: true,
            req,
        };

        renderer.renderToString(
            context,
            (err, html) => {
                if (err) {
                    return res.status(500).end(err.message);
                }

                return res.header(
                    'Content-type',
                    'text/html',
                ).end(html);
            }
        );
    };
};

/**
 * Creates express middleware based on the environment.
 * In development mode, a dev server taking care of the webpack build
 * process is provided.
 * In production mode, the resulting server-bundle is served.
 *
 * @param app Express app
 * @param mode NODE_ENV
 * @param clientConfig Webpack client configuration
 * @param serverConfig Webpack server configuration
 * @param serverBundlePath Path to the generated server bundle
 * @param templatePath Path to the html template
 * @returns {Function} Express middleware
 */
export default (app: Application, {
    clientConfig,
    serverConfig,
    serverBundlePath,
    clientManifestPath,
    templatePath,
}: Partial<IDevelopmentOptions & IProductionOptions>): RequestHandler => {
    if (process.env.NODE_ENV === 'development') {
        if (!clientConfig) {
            throw new Error('`clientConfig` is required for development mode.');
        }

        if (!serverConfig) {
            throw new Error('`serverConfig` is required for development mode.');
        }

        if (!templatePath) {
            throw new Error('`templatePath` is required for development mode.');
        }

        return createDevMiddleware(app, {
            clientConfig,
            serverConfig,
            templatePath,
        });
    }

    if (!serverBundlePath) {
        throw new Error('`serverBundlePath` is required for production mode.');
    }

    if (!clientManifestPath) {
        throw new Error('`clientManifestPath` is required for production mode.');
    }

    if (!templatePath) {
        throw new Error('`templatePath` is required for production mode.');
    }

    return createMiddleware({
        serverBundlePath,
        clientManifestPath,
        templatePath,
    });
};
