/**
 *Created by zmj on 2018/8/29
 */
import Main from '@/views/scene-common/main-page/Main.vue';

export const projectDetail = {
    name: '六方云智',
    scene: '企业内网态势感知'
};

export const router = [
    {
        title: '首页',
        children: [
            {
                path: '/main_page',
                title: '首页',
                icon: 'icon-guanliyukongzhi',
                name: 'main_page',
                component: Main,
                children: [
                    {
                        path: 'index_intrusion',
                        title: '大屏总览',
                        name: 'home_index',
                        component: () => import('@/views/scene-intranet/big_screen/overview_screen.vue')
                    },
                ]}
        ]
    },
    {
        title: '资产画像',
        children: [
            {
                path: '/access',
                icon: 'icon-guanliyukongzhi',
                name: 'access',
                title: '资产定义',
                component: Main,
                children: [
                    {
                        path: 'index_group',
                        title: '资产分组',
                        name: 'asset_group',
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
                    },
                ]
            },
            {
                path: '/productVulnerability',
                icon: 'icon-anquanzujian',
                title: '资产脆弱性',
                name: 'product_vulnerability',
                // access: 0,
                component: Main,
                children: [
                    {
                        path: 'productLoopholeTask',
                        title: '漏扫任务',
                        name: 'product_loophole_task',
                        // access: 0,
                        component: () => import('@/views/scene-clouddc/product_vulnerability/product_loophole_task/product_loophole_task.vue')
                    },
                    {
                        path: 'productResultVisibility',
                        title: '漏扫结果可视化',
                        name: 'product_result_visibility',
                        // access: 0,
                        component: () => import('@/views/scene-clouddc/product_vulnerability/product_result_visibility/product_result_visibility.vue')
                    },
                    {
                        path: 'taskDetail',
                        title: '任务详情',
                        name: 'task_detail',
                        // access: -1,
                        hideInMenu: true,
                        notCache: true,
                        component: () => import('@/views/scene-clouddc/product_vulnerability/task_detail/task_detail.vue')
                    },
                    {
                        path: 'report',
                        title: '报告',
                        name: 'report',
                        // access: -1,
                        hideInMenu: true,
                        notCache: true,
                        component: () => import('@/views/scene-clouddc/product_vulnerability/report/report.vue')
                    },
                    {
                        path: 'reportDetail',
                        title: '报告详情',
                        name: 'report_detail',
                        // access: -1,
                        hideInMenu: true,
                        notCache: true,
                        component: () => import('@/views/scene-clouddc/product_vulnerability/report_detail/report_detail.vue')
                    },
                    {
                        path: 'result',
                        title: '结果',
                        name: 'result',
                        // access: -1,
                        hideInMenu: true,
                        notCache: true,
                        component: () => import('@/views/scene-clouddc/product_vulnerability/result/result.vue')
                    },
                    {
                        path: 'resultDetail',
                        title: '结果详情',
                        name: 'result_detail',
                        // access: -1,
                        hideInMenu: true,
                        notCache: true,
                        component: () => import('@/views/scene-clouddc/product_vulnerability/result_detail/result_detail.vue')
                    },
                    {
                        path: 'host',
                        title: 'host',
                        name: 'host',
                        // access: -1,
                        hideInMenu: true,
                        notCache: true,
                        component: () => import('@/views/scene-clouddc/product_vulnerability/host/host.vue')
                    },
                    {
                        path: 'hostDetail',
                        title: 'host详情',
                        name: 'host_detail',
                        // access: -1,
                        hideInMenu: true,
                        notCache: true,
                        component: () => import('@/views/scene-clouddc/product_vulnerability/host_detail/host_detail.vue')
                    },
                    {
                        path: 'operateSystem',
                        title: '系统指令详情',
                        name: 'operate_system',
                        // access: -1,
                        hideInMenu: true,
                        notCache: true,
                        component: () => import('@/views/scene-clouddc/product_vulnerability/operate_system/operate_system.vue')
                    },
                    {
                        path: 'nvt',
                        title: '网络虚拟终端',
                        name: 'nvt',
                        // access: -1,
                        hideInMenu: true,
                        notCache: true,
                        component: () => import('@/views/scene-clouddc/product_vulnerability/NVT/NVT.vue')
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
                    {
                        path: 'index_server_c',
                        title: '业务/服务器',
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
    },
    {
        title: 'AI智能',
        children: [
            {
                path: '/sa_modelIndex',
                title: '存储检索',
                icon: 'icon-guanliyukongzhi',
                name: 'sa_modelIndex',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '存储检索',
                        name: 'sa_modelIndex_child',
                        component: () => import('@/views/scene-clouddc/intelli_sense/sa_modelIndex.vue')
                    }
                ]
            },{
                path: '/reduce',
                icon: 'icon-guanliyukongzhi',
                name: 'reduce',
                title: '日志聚合',
                component: Main,
                children: [
                    {
                        path: 'index_log_reduce',
                        title: '日志聚合',
                        name: 'log_reduce',
                        component: () => import('@/views/scene-intranet/log_reduce/log_reduce.vue')
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
    // {
    //     title: '威胁情报',
    //     children: [
    //         {
    //             path: '/sa_modelIndex1111',
    //             title: '漏洞统计',
    //             icon: 'icon-guanliyukongzhi',
    //             name: 'sa_modelIndex1111',
    //             component: Main,
    //             children: [
    //                 {
    //                     path: 'index1111',
    //                     title: '漏洞统计',
    //                     name: 'sa_modelIndex_child1111',
    //                     component: () => import('@/views/scene-clouddc/intelli_sense/sa_modelIndex.vue')
    //                 }
    //             ]
    //         },
    //         {
    //             path: '/sa_modelIndex2222',
    //             title: '漏洞列表',
    //             icon: 'icon-guanliyukongzhi',
    //             name: 'sa_modelIndex2222',
    //             component: Main,
    //             children: [
    //                 {
    //                     path: 'index2222',
    //                     title: '漏洞列表',
    //                     name: 'sa_modelIndex_child2222',
    //                     component: () => import('@/views/scene-clouddc/intelli_sense/sa_modelIndex.vue')
    //                 }
    //             ]
    //         },
    //         {
    //             path: '/sa_modelIndex3333',
    //             title: '安全新闻',
    //             icon: 'icon-guanliyukongzhi',
    //             name: 'sa_modelIndex3333',
    //             component: Main,
    //             children: [
    //             {
    //                 path: 'index3333',
    //                 title: '安全新闻',
    //                 name: 'sa_modelIndex_child3333',
    //                 component: () => import('@/views/scene-clouddc/intelli_sense/sa_modelIndex.vue')
    //             }
    //         ]
    //         }
    //     ]
    // },
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
            // {
            //     path: '/alarm',
            //     title: '告警页面',
            //     icon: 'icon-shangwanghangweiganzhi',
            //     name: 'alarmPage',
            //     component: Main,
            //     children: [
            //         {
            //             path: 'index',
            //             title: '告警页面',
            //             name: 'alarmPage_index',
            //             component: () => import('@/views/scene-common/ssa_alarm/alarmPage.vue')
            //         }
            //     ]
            // },

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

];

