import type { Application } from 'express';

import commonLoader from './common';
import bundleLoader from './bundle';
import staticLoader from './static';

/**
 * Imports and applies loaders that extend the application by different
 * features, like parsing, session and database handling.
 * @param {Application} app
 * @return {Promise<void>}
 */
export default async (app: Application): Promise<void> => {
    await commonLoader(app);
    await staticLoader(app);
    await bundleLoader(app);
}
