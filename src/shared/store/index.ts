import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

export interface AppState {
    message: string;
}

export default (): Store<AppState> => new Store<AppState>({
    state: {
        message: 'Hey! I am rendered universally.',
    },
});
