import config from '@/main-config/';

import {router} from '@/router/env';

import Cookies from 'js-cookie';

// 不作为Main组件的子页面展示的页面单独写
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/scene-common/login/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/components/locale-components/iview-admin/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/components/locale-components/iview-admin/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/components/locale-components/iview-admin/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/scene-demo/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/components/locale-components/iview-admin/main-components/lockscreen/components/locking-page.vue')
};

export const otherRouter = require('./router-common/router-common').default;

let routerCheck = router;

if (config.development) routerCheck = require(`./router-modules/router-${config.defaultRouter}`).router;

if (!config.defaultMenu) {

    let des = [];

    routerCheck.forEach((item) => {
        item.children.forEach((e) => {
                des.push(e);
        });


    });

    routerCheck = des;

}

export const appRouter = routerCheck;

export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
