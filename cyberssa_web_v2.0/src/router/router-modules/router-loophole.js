import Main from '@/views/scene-common/main-page/Main.vue';

export const projectDetail = {
    name: '云智',
    scene: '资产管家'
};

export const router = [
    {
        title: '平台总览',
        children: [
            {
                // path: '/bigScreen',

                path: '/main_page',
                title: '统计总览',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'main_page',
                component: Main,
                children: [
                    {
                        // path: 'index',
                        path: 'index_intrusion',
                        title: '统计总览',
                        name: 'home_index',
                        component: () => import('@/views/scene-asset/bigScreen/countPandect.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '漏扫分析',
        children: [
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
    {
        title: '漏扫配置',
        children: [
            {
                path: '/scanTask',
                title: '扫描任务',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'scanTaskPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '扫描任务',
                        name: 'scanTaskPage_index',
                        component: () => import('@/views/scene-asset/leakageConfig/scanTask/scanTask.vue')
                    }
                ]
            },
            {
                path: '/scanTarget',
                title: '扫描目标',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'scanTargetPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '扫描目标',
                        name: 'scanTargetPage_index',
                        component: () => import('@/views/scene-asset/leakageConfig/scanTarget/scanTarget.vue')
                    }
                ]
            },
            {
                path: '/leakageConfig',
                title: '站点扫描配置',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'leakageConfigPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '站点扫描配置',
                        name: 'leakageConfigPage_index',
                        component: () => import('@/views/scene-asset/leakageConfig/siteScanConfig/siteScanConfig.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '报表管理',
        children: [
            {
                path: '/reportModel',
                title: '报表模板',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'reportModelPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '报表模板',
                        name: 'reportModelPage_index',
                        component: () => import('@/views/scene-common/report/report-model/report-model.vue')
                    }
                ]
            },
            {
                path: '/reportTask',
                title: '报表任务',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'reportTaskPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '报表任务',
                        name: 'reportTaskPage_index',
                        component: () => import('@/views/scene-common/report/report-task/report-task.vue')
                    }
                ]
            },
            {
                path: '/reportList',
                title: '报表列表',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'reportListPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '报表列表',
                        name: 'reportListPage_index',
                        component: () => import('@/views/scene-common/report/report-list/report-list.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '威胁情报库',
        children: [
            {
                path: '/threat',
                title: '威胁情报总览',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'threatPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '威胁情报总览',
                        name: 'threatPage_index',
                        component: () => import('@/views/scene-asset/threat/threatIntelligence/threatIntelligence.vue')
                    }
                ]
            },
            {
                path: '/ipAddress',
                title: 'IP地址信息库',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'ipAddrressPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: 'IP地址信息库',
                        name: 'ipAddrressPage_index',
                        component: () => import('@/views/scene-asset/threat/ipAddress/ipAddress.vue')
                    }
                ]
            },
            {
                path: '/siteInfo',
                title: '站点信息库',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'siteInfoPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '站点信息库',
                        name: 'siteInfoPage_index',
                        component: () => import('@/views/scene-asset/threat/siteInfo/siteInfo.vue')
                    }
                ]
            },
            {
                path: '/loopholeInfo',
                title: '漏洞信息库',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'loopholeInfoPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '漏洞信息库',
                        name: 'loopholeInfoPage_index',
                        component: () => import('@/views/scene-asset/threat/loopholeInfo/loopholeInfo.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '告警配置',
        children: [
            {
                path: '/safeAlarm',
                title: '安全告警配置',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'safeAlarmPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '安全告警配置',
                        name: 'safeAlarmPage_index',
                        component: () => import('@/views/scene-common/ssa_alarm/alarmConfig.vue')
                    }
                ]
            },
            {
                path: '/alarm',
                title: '告警页面',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'alarmPage',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '告警页面',
                        name: 'alarmPage_index',
                        component: () => import('@/views/scene-common/ssa_alarm/alarmPage.vue')
                    }
                ]
            }
        ]
    },

];
