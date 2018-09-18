import Vue from 'vue';
import BaiduMap from 'vue-baidu-map';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import '@/libs/locale-i18n';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import echarts from 'echarts';
import lodash from 'lodash';
import world from '@/components/common-components/tp-echarts-plugin/geoJson/world.json';

import '../static/iconfont/iconfont.css';

import '@/styles/common.css';

import axios from './http';


Vue.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: 'ptHIPtqRNKWATLgkBSI3iDpz0yhVUM60'
});
Vue.use(VueI18n);
Vue.use(iView);

Vue.prototype._ = lodash;
Vue.prototype.$http = axios;
Vue.prototype.$echarts = echarts;

echarts.registerMap('world', world);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;

        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');

        this.$store.commit('initCachepage');

        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
