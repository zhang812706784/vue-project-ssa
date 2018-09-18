/*
 *Created by liyanan on 2018/9/11
 */
import Main from '@/views/scene-common/main-page/Main.vue';

export const projectDetail = {
    name: '六方云智',
    scene: '态势感知探针'
};

export const router = [
    {
        title: '信息采集',
        children: [
            {
                //path: '/access',
                path: '/main_page',
                icon: 'icon-gongjifenxi',
                name: 'access',
                title: '资产定义',
                component: Main,
                children: [
                    {
                        //path: 'index_group',
                        path: 'index_intrusion',
                        title: '资产分组',
                        //name: 'asset_group',
                        name: 'home_index',
                        component: () => import('@/views/scene-clouddc/asset/group.vue')
                    },
                    {
                        path: 'index_server',
                        title: '业务/服务器',
                        name: 'service_server',
                        component: () => import('@/views/scene-clouddc/asset/server.vue')
                    },
                    {
                        path: 'index_vm',
                        title: '终端',
                        name: 'asset_virtual',
                        component: () => import('@/views/scene-clouddc/asset/vm.vue')
                    },
                    {
                        path: 'index_branch',
                        title: '分支管理',
                        name: 'branch_mgr',
                        component: () => import('@/views/scene-clouddc/asset/branch.vue')
                    }
                ]
            },
            {
                path: '/access-test',
                icon: 'icon-anquanzujian',
                name: 'access12',
                title: '设备运行检测',
                component: Main,
                children: [
                    // {
                    //     path: 'index_server_c',
                    //     title: '业务/服务器',
                    //     name: 'service_server_c',
                    //     component: () => import('@/views/scene-clouddc/asset/server_checked.vue')
                    // },
                    {
                        path: 'index_server_c',
                        title: '上位机',
                        name: 'service_server_c',
                        component: () => import('@/views/scene-clouddc/asset/server_checked.vue')
                    },
                    {
                        path: 'index_vm_c',
                        title: '终端',
                        name: 'asset_virtual_c',
                        component: () => import('@/views/scene-clouddc/asset/vm_checked.vue')
                    }
                ]
            },
            {
                path: '/selfAnalysis',
                title: '自身分析',
                icon: 'icon-fangwenfenxi_1',
                name: 'serverSelf',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '自身分析',
                        name: 'serverSelf_child',
                        component: () => import('@/views/ssa-probe/selfAnalysis.vue')
                    }
                ]
            },
            {
                path: '/loopholeScan',
                title: '漏洞扫描',
                icon: 'icon-guanliyukongzhi',
                name: 'loopholeScan1',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '漏洞扫描',
                        name: 'loopholeScan_index',
                        component: () => import('@/views/ssa-probe/loopholeScan.vue')
                    }
                ]
            },
            {
                path: '/threatAssessment',
                title: '威胁评估',
                icon: 'icon-guanliyukongzhi',
                name: 'threatAssessment1',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '威胁评估',
                        name: 'threatAssessment_index',
                        component: () => import('@/views/ssa-probe/threatAssessment.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '日志审计',
        children: [
            {
                path: '/association',
                title: '关联分析',
                icon: 'icon-guanliyukongzhi',
                name: 'sa_modelIndex',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '关联分析',
                        name: 'sa_modelIndex_child',
                        component: () => import('@/views/scene-clouddc/intelli_sense/sa_modelIndex.vue')
                    }
                ]
            },
            {
                path: '/access',
                icon: 'icon-guanliyukongzhi',
                name: 'access',
                title: '审计中心',
                component: Main,
                children: [
                    {
                        path: 'index_log_audit',
                        title: '审计中心',
                        name: 'log_audit',
                        component: () => import('@/views/scene-clouddc/log_audit/log_audit.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '决策响应',
        children: [
            {
                path: '/safeAlarm',
                title: '安全告警',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'safeAlarmPage',
                component: Main,
                children: [
                    {
                        path: 'safeAlarmIndex',
                        title: '安全告警配置',
                        name: 'safeAlarmPage_index',
                        component: () => import('@/views/scene-common/ssa_alarm/alarmConfig.vue')
                    },
                    {
                        path: 'alarmPageIndex',
                        title: '告警页面',
                        name: 'alarmPage_index',
                        component: () => import('@/views/scene-common/ssa_alarm/alarmPage.vue')
                    }
                ]
            },

            {
                path: '/report',
                title: '安全报表',
                icon: 'icon-shangwanghangweiganzhi',
                name: 'reportModelPage',
                component: Main,
                children: [
                    {
                        path: 'reportModelIndex',
                        title: '报表模板',
                        name: 'reportModelPage_index',
                        component: () => import('@/views/scene-common/report/report-model/report-model.vue')
                    },
                    {
                        path: 'reportTaskIndex',
                        title: '报表任务',
                        name: 'reportTaskPage_index',
                        component: () => import('@/views/scene-common/report/report-task/report-task.vue')
                    },
                    {
                        path: 'reportListIndex',
                        title: '报表列表',
                        name: 'reportListPage_index',
                        component: () => import('@/views/scene-common/report/report-list/report-list.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '内部威胁',
        children: [
            {
                path: '/content_aware',
                title: '内网舆情监控',
                name: 'content_aware',
                icon: 'icon-guanliyukongzhi',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '内网舆情监控',
                        name: 'content',
                        component: () => import('@/views/scene-clouddc/global_perspective/content_aware.vue')
                    }
                ]
            },
            {
                path: '/insider_threat_perception',
                title: '内部威胁感知',
                icon: 'icon-guanliyukongzhi',
                name: 'insider_threat_perception',
                component: Main,
                children: [
                    {
                        path: '/forgery_attack',
                        title: '伪造信息',
                        name: 'forgery_attack',
                        component: () => import('@/views/scene-intranet/Internal_threat/threat_perception/forgery_attack.vue')
                    },
                    {
                        path: '/information_gathering',
                        title: '信息收集',
                        name: 'information_gathering',

                        component: () => import('@/views/scene-intranet/Internal_threat/threat_perception/information_gathering.vue')
                    },
                    {
                        path: '/datadriven_attack',
                        title: '数据驱动',
                        name: 'datadriven_attack',
                        component: () => import('@/views/scene-intranet/Internal_threat/threat_perception/datadriven_attack.vue')
                    },
                    {
                        path: '/denial_service',
                        title: '拒绝服务',
                        name: 'denial_service',
                        component: () => import('@/views/scene-intranet/Internal_threat/threat_perception/denial_service.vue')
                    },
                    {
                        path: '/information_utilization',
                        title: '信息利用',
                        name: 'information_utilization',
                        component: () => import('@/views/scene-intranet/Internal_threat/threat_perception/information_utilization.vue')
                    },
                    {
                        path: '/illegal_visit',
                        title: '非法访问',
                        name: 'illegal_visit',
                        component: () => import('@/views/scene-intranet/Internal_threat/threat_perception/illegal_visit.vue')
                    }
                ]
            },
            {
                path: '/internal_network_topology',
                title: '内部网络拓扑',
                icon: 'icon-guanliyukongzhi',
                name: 'internal_network_topology',
                component: Main,
                children: [
                    {
                        path: '/access_relations',
                        title: '访问关系',
                        name: 'access_relations',
                        component: () => import('@/views/scene-intranet/Internal_threat/network_topology/access_relations.vue')
                    },
                    {
                        path: '/ec_behavior',
                        title: '横向行为画像',
                        name: 'ec_behavior',
                        component: () => import('@/views/scene-intranet/Internal_threat/network_topology/ec_behavior.vue')
                    },
                    {
                        path: '/lateral_behavior',
                        title: '外联行为画像',
                        name: 'lateral_behavior',
                        component: () => import('@/views/scene-intranet/Internal_threat/network_topology/lateral_behavior.vue')
                    }
                ]
            },
        ]
    },
    {
        title: '外部威胁',
        children: [
            {
                path: '/global_perspective',
                title: '威胁总览',
                icon: 'icon-guanliyukongzhi',
                name: 'global_perspective',
                component: Main,
                children: [
                    {
                        path: 'intrusion_all',
                        title: '威胁总览',
                        name: 'intrusion_all1',
                        component: () => import('@/views/scene-clouddc/global_perspective/sa_sec/sec_big.vue')
                    },

                ]},{
                path: '/intrusion_situation',
                title: '入侵态势',
                icon: 'icon-guanliyukongzhi',
                name: 'intrusion_situation',
                component: Main,
                children: [

                    {
                        path: 'index_intrusion',
                        title: '入侵态势',
                        name: 'intrusion',
                        component: () => import('@/views/scene-intranet/sa_sec/intrusion_situation.vue')
                    },
                ]
            },
            {
                path: '/index_abnormal',
                title: '异常流量',
                icon: 'icon-guanliyukongzhi',
                name: 'index_abnormal',
                component: Main,
                children: [
                    {
                        path: 'index_abnormal',
                        title: '异常流量',
                        name: 'abnormal',
                        component: () => import('@/views/scene-intranet/sa_sec/abnormal_flow.vue')
                    },
                ]
            },
            {
                path: '/index_abnormal_scan',
                title: '异常扫描',
                icon: 'icon-guanliyukongzhi',
                name: 'index_abnormal_scan',
                component: Main,
                children: [
                    {
                        path: 'index_abnormal_scan',
                        title: '异常扫描',
                        name: 'abnormal_scan',
                        component: () => import('@/views/scene-intranet/sa_sec/abnormal_scanning.vue')
                    },
                ]
            },
            {
                path: '/index_dns',
                title: 'DNS监控',
                icon: 'icon-guanliyukongzhi',
                name: 'index_dns',
                component: Main,
                children: [
                    {
                        path: 'index_dns',
                        title: 'DNS监控',
                        name: 'dns',
                        component: () => import('@/views/scene-intranet/sa_sec/dns_monitoring.vue')
                    },

                ]
            },
            {
                path: '/index',
                title: '恶意代码',
                icon: 'icon-guanliyukongzhi',
                name: 'index',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '恶意代码',
                        name: 'av',
                        component: () => import('@/views/scene-intranet/sa_sec/av_code.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '攻击溯源',
        children: [
            {
                path: '/sa_sec_hacker_menu',
                icon: 'icon-anquanzujian',
                title: '黑客画像',
                name: 'sa_sec_hacker_menu',
                component: Main,
                children: [
                    {
                        path: 'sec_hacker_menu',
                        title: '黑客画像',
                        name: 'sec_hacker_menu',
                        component: () => import('@/views/scene-clouddc/intelli_sense/attacksource/sec_hacker.vue')
                    }

                ]
            },
            {
                path: '/sa_sec_target_menu',
                icon: 'icon-anquanzujian',
                title: '目标画像',
                name: 'sa_sec_target_menu',
                component: Main,
                children: [
                    {
                        path: 'sec_target_menu',
                        title: '目标画像',
                        name: 'sec_target_menu',
                        component: () => import('@/views/scene-clouddc/intelli_sense/attacksource/sec_target.vue')
                    }
                ]
            }
        ]
    },
    {
        title: '应用感知',
        children: [
            {
                path: '/application_aware',
                title: '应用感知',
                icon: 'icon-guanliyukongzhi',
                name: 'application_aware',
                component: Main,
                children: [
                    {
                        path: '/view',
                        title: '应用总览',
                        name: 'view',

                        component: () => import('@/views/scene-clouddc/global_perspective/application_overview/application_view.vue')
                    },
                    {
                        path: '/recognition',
                        title: '应用识别感知',
                        name: 'recognition',

                        component: () => import('@/views/scene-clouddc/global_perspective/application_overview/application_recognition.vue')
                    },
                    {
                        path: '/perception',
                        title: '应用阻断感知',
                        name: 'perception',

                        component: () => import('@/views/scene-clouddc/global_perspective/application_overview/blocking_perception.vue')
                    },
                    {
                        path: 'index',
                        title: '安全阻断',
                        name: 'blocking',
                        component: () => import('@/views/scene-clouddc/global_perspective/blocking_up.vue')
                    }
                ]
            },
        ]
    }
];

