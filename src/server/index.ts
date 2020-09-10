import createApp from '@/index';
import { VueAppContext } from './plugins/bundle-middleware';

/**
 * Vue server entrypoint.
 */
export default async (context: VueAppContext): Promise<any> => {
    const { app, store } = await createApp();

    context.rendered = () => {
        context.state = store.state;
    };

    return app;
};
