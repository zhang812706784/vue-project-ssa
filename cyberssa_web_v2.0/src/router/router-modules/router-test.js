import Main from '@/views/scene-common/main-page/Main.vue';

export const projectDetail = {
    name: '六方云',
    scene: 'XXX模块123'
};

export const router = [
    {
        title: '一级菜单',
        children: [
            {
                path: '/home',
                title: '二级菜单',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'errorpage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '三级按钮',
                        name: 'check',
                        access: 0,
                        component: () => import('@/components/locale-components/iview-admin/error-page/error-page.vue')
                    },
                    {
                        path: 'text-editor',
                        icon: 'compose',
                        name: 'text-editor',
                        title: '富文本编辑器',
                        component: () => import('@/components/locale-components/iview-admin/text-editor/text-editor.vue')
                    }
                ]
            },
            {
                path: '/access',
                icon: 'icon-guanliyukongzhi',
                name: 'access',
                title: '权限管理',
                component: Main,
                children: [
                    {
                        path: '/index',
                        title: '权限管理二级',
                        name: 'home_index345',
                        component: () => import('@/views/scene-demo/access/access.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '一级菜单',
        children: [
            {
                path: '/test-page',
                icon: 'icon-shangwanghangweiganzhi',
                title: '测试二级',
                name: 'testPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '测试页面',
                        name: 'testPage_index',
                        component: () => import('@/views/scene-test-page/test-page.vue')
                    },
                    {
                        path: 'echarts',
                        title: '首页-echarts',
                        name: 'home_index',
                        component: () => import('@/views/scene-test-page/test-import-echarts.vue')
                    },
                    {
                        path: 'tab',
                        title: 'XXX页',
                        name: 'testPage_XXX',
                        component: () => import('@/views/scene-test-page/test-page.vue')
                    }
                ]
            },
        ]
    },
    {
        title: '一级菜单',
        children: [
            {
                path: '/report',
                icon: 'icon-shangwanghangweiganzhi',
                title: '报表管理',
                name: 'reportPage',
                component: Main,
                children: [
                    {
                        path: 'index1',
                        title: '报表模板',
                        name: 'reportPage_index1',
                        component: () => import('@/views/scene-common/report/report-model/report-model.vue')
                    },
                    {
                        path: 'index2',
                        title: '报表任务',
                        name: 'reportPage_index2',
                        component: () => import('@/views/scene-common/report/report-task/report-task.vue')
                    },
                    {
                        path: 'index3',
                        title: '报表列表',
                        name: 'reportPage_index3',
                        component: () => import('@/views/scene-common/report/report-list/report-list.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '一级菜单',
        children: [
            {
                path: '/report1',
                icon: 'icon-shangwanghangweiganzhi',
                title: '告警配置',
                name: 'reportPage1',
                component: Main,
                children: [
                    {
                        path: 'index1',
                        title: '安全告警配置',
                        name: 'alarmPage_index1',
                        component: () => import('@/views/scene-common/ssa_alarm/alarmConfig.vue')
                    },
                    {
                        path: 'index2',
                        title: '告警页面',
                        name: 'alarmPage_index2',
                        component: () => import('@/views/scene-common/ssa_alarm/alarmPage.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '漏扫分析',
        children: [
            {
                path: '/bigScreen',
                title: '统计总览',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'bigScreenPage',
                access: 0,
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '统计总览',
                        name: 'bigScreen_index',
                        access: 0,
                        component: () => import('@/views/scene-asset/bigScreen/countPandect.vue')
                    }
                ]
            },
            {
                path: '/ip',
                icon: 'icon-shangwanghangweiganzhi',
                title: 'IP分析',
                name: 'ipPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: 'IP分析',
                        name: 'ipPage_index',
                        component: () => import('@/views/scene-asset/leakageAnalysis/ipAnalysis/ipAnalysis.vue')
                    }
                ]
            },
            {
                path: '/site',
                icon: 'icon-shangwanghangweiganzhi',
                title: '站点分析',
                name: 'sitePage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '站点分析',
                        name: 'sitePage_index',
                        component: () => import('@/views/scene-asset/leakageAnalysis/siteAnalysis/siteAnalysis.vue')
                    }
                ]
            },
            {
                path: '/loophole',
                icon: 'icon-shangwanghangweiganzhi',
                title: '漏洞分析',
                name: 'loopholePage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '漏洞分析',
                        name: 'loopholePage_index',
                        component: () => import('@/views/scene-asset/leakageAnalysis/loopholeAnalysis/loopholeAnalysis.vue')
                    }
                ]
            }
        ]
    },
];
