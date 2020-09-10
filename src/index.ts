import express from 'express';
import dotenv from 'dotenv';

import registerLoaders from './server/loaders';

/**
 * Wires up the different parts of the application, like loaders, models,
 * services and starts the server.
 * @return {Promise<void>}
 */
async function bootstrap(): Promise<void> {
    dotenv.config();

    const app = express();
    const port = process.env.PORT || 8080;

    await registerLoaders(app);

    app.listen(port, () => {
        // TODO: Use a more sophisticated loggin approach for a real-world production app
        console.info(`Server listening on port ${port}.`);
    });
}

bootstrap().catch(console.error.bind(console));
