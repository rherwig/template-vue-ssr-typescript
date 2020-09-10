import createApp from '@/index';

createApp().then(({ app, store }) => {
    if (window.__INITIAL_STATE__) {
        store.replaceState(window.__INITIAL_STATE__);
    }

    app.$mount('#vue-root');
});

if (process.env.NODE_ENV === 'development') {
    require('webpack-hot-middleware/client');

    if (module.hot) {
        module.hot.accept();
    }
}
