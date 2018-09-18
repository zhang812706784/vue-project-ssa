import Vue from 'vue';
import Vuex from 'vuex';

import app from '@/store/store-modules/store-app';
import user from '@/store/store-modules/store-user';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {},
    modules: {
        app,
        user
    }
});

export default store;
