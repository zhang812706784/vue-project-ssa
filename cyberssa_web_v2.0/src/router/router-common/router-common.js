import Main from '@/views/scene-common/main-page/Main.vue';

const common = {
    path: '/',
    name: 'otherRouter',
    redirect: '/main_page/index_intrusion',
    component: Main,
    children: [
        {
            path: 'ownspace',
            title: '修改密码',
            name: 'ownspace_index',
            component: () => import('@/views/scene-common/manage/userManage/userManage.vue')
        },
        // 用于展示带参路由
        {
            path: 'message',
            title: '消息中心',
            name: 'message_index',
            component: () => import('@/views/scene-common/message/message.vue')
        },
        {
            path: 'userManage',
            title: '用户管理',
            name: 'userManage',
            component: () => import('@/views/scene-common/manage/userManage/userManage.vue')
        },

        {
            path: 'systemManage',
            title: '系统管理',
            name: 'systemManage',
            component: () => import('@/views/scene-common/manage/systemManage/systemManage.vue')
        },
        {
            path: 'sec_hacker',
            title: '黑客画像',
            name: 'sec_hacker',
            component: () => import('@/views/scene-intranet/sa_sec/attacksource/sec_hacker.vue')
        },
        {
            path: 'sec_target',
            title: '目标画像',
            name: 'sec_target',
            component: () => import('@/views/scene-intranet/sa_sec/attacksource/sec_target.vue')
        },
        {
            path: 'sec_traceback',
            title: '入侵回溯',
            name: 'sec_traceback',
            component: () => import('@/views/scene-intranet/sa_sec/attacksource/sec_traceback.vue')
        },
        {
            path: 'ipListDetail',
            title: 'ip分析详情',
            name: 'ipListDetail',
            component: () => import('@/views/scene-asset/leakageAnalysis/ipAnalysis/ipListDetail.vue')
        },
        {
            path: 'siteListDetail',
            title: '站点分析详情',
            name: 'siteListDetail',
            component: () => import('@/views/scene-asset/leakageAnalysis/siteAnalysis/siteListDetail.vue')
        }
    ]
};

export default common;
