import Vue from 'vue';
import { Store } from 'vuex';

import createStore, { AppState } from '@/store';
import App from '@/components/App.vue';

if (process.env.NODE_ENV !== 'production') {
    Vue.config.productionTip = false;
}

export interface CreateAppResult {
    app: Vue,
    store: Store<AppState>,
}

export default async (): Promise<CreateAppResult> => {
    const store = createStore();
    const app = new Vue({
        render: h => h(App),
        store,
    });

    return {
        app,
        store,
    };
}
