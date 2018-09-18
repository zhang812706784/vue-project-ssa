import Main from '@/views/scene-common/main-page/Main.vue';

export const projectDetail = {
    name: '六方云',
    scene: '工业蜜罐'
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
                        component: () => import('@/views/scene-clouddc/global_perspective/intrusion_situation.vue')
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
    // {
    //     title: '网络态势',
    //     children: [
    //         {
    //             path: '/sa_network',
    //             title: '网络总览',
    //             icon: 'icon-guanliyukongzhi',
    //             name: '/sa_network/main_page',
    //             component: Main,
    //             children: [
    //                 {
    //                     path: 'main_page',
    //                     title: '大屏总览',
    //                     name: 'main_page',
    //                     component: () => import('@/views/scene-clouddc/sa_network/net_big/net_big.vue')
    //                 }
    //             ]
    //         },
    //         {
    //             path: '/sa_network',
    //             title: '安全域',
    //             icon: 'icon-guanliyukongzhi',
    //             name: 'sa_network_net_vns_name',
    //             component: Main,
    //             children: [
    //                 {
    //                     path: 'net_vns',
    //                     title: '安全域',
    //                     name: 'vum_flow',
    //                     component: () => import('@/views/scene-clouddc/sa_network/net_vn/net_vn.vue')
    //                 }
    //             ]
    //
    //         },
    //         {
    //             path: '/sa_network',
    //             title: '东西向流量',
    //             icon: 'icon-guanliyukongzhi',
    //             name: 'sa_network_net_east_west_name',
    //             component: Main,
    //             children: [
    //                 {
    //                     path: '/sa_network/net_east_west/vms',
    //                     title: '虚机流量',
    //                     name: 'sa_network_net_east_west_vms',
    //                     component: () => import('@/views/scene-clouddc/sa_network/net_vm/vms.vue')
    //                 },
    //                 {
    //                     path: '/sa_network/net_east_west/ifs_name',
    //                     title: '接口流量',
    //                     name: 'sa_network_net_east_west_ifs',
    //                     component: () => import('@/views/scene-clouddc/sa_network/net_if/net_if.vue')
    //                 },
    //                 {
    //                     path: '/sa_network/net_east_west_app/traffic_name',
    //                     title: '应用流量',
    //                     name: 'sa_network_net_east_west_app_traffic',
    //                     component: () => import('@/views/scene-clouddc/sa_network/net_east_west_app/net_east_west_app.vue')
    //                 },
    //                 {
    //                     path: '/sa_network/net_east_west_usr/traffic_name',
    //                     title: '用户流量',
    //                     name: 'sa_network_net_east_west_usr_traffic',
    //                     component: () => import('@/views/scene-clouddc/sa_network/net_east_west_usr/net_east_west_usr.vue')
    //                 },
    //                 {
    //                     path: '/sa_network/net_east_west_ip/traffic_name',
    //                     title: 'IP流量',
    //                     name: 'sa_network_net_east_west_ip_traffic',
    //                     component: () => import('@/views/scene-clouddc/sa_network/net_east_west_ip/net_east_west_ip.vue')
    //                 }
    //             ]
    //         },
    //         {
    //             path: '/sa_network/net_north_south',
    //             title: '南北向流量',
    //             icon: 'icon-guanliyukongzhi',
    //             name: 'sa_network_net_north_south',
    //             component: Main,
    //             children: [
    //                 {
    //                     path: '/sa_network/net_north_south_app/traffic_name',
    //                     title: '应用流量',
    //                     name: 'sa_network_net_north_south_app_traffic',
    //                     component: () => import('@/views/scene-clouddc/sa_network/net_north_south_app/net_north_south_app.vue')
    //                 },
    //                 {
    //                     path: '/sa_network/net_north_south_usr/traffic_name',
    //                     title: '用户流量',
    //                     name: 'sa_network_net_north_south_usr_traffic',
    //                     component: () => import('@/views/scene-clouddc/sa_network/net_north_south_usr/net_north_south_usr.vue')
    //                 },
    //                 {
    //                     path: '/sa_network/net_north_south_ip/traffic_name',
    //                     title: 'IP流量',
    //                     name: 'sa_network_net_north_south_ip_traffic',
    //                     component: () => import('@/views/scene-clouddc/sa_network/net_north_south_ip/net_north_south_ip.vue')
    //                 }
    //             ]
    //         }
    //     ]
    // },
    {
        title: '外部威胁',
        children: [
            {
            path: '/intrusion_all',
            title: '威胁总览',
                icon: 'icon-guanliyukongzhi',
            name: 'intrusion_all',
            component: Main,
            children: [
                {
                    path: 'intrusion_all',
                    title: '威胁总览',
                    name: 'intrusion_all1',
                    component: () => import('@/views/scene-clouddc/global_perspective/sa_sec/sec_big.vue')
                }
                ]
            },
            {
                path: '/intrusion_situation',
                title: '网络入侵',
                icon: 'icon-guanliyukongzhi',
                name: 'intrusion_situation',
                component: Main,
                children: [
                    {
                        path: 'index_intrusion',
                        title: '入侵态势',
                        name: 'intrusion',
                        component: () => import('@/views/scene-clouddc/global_perspective/intrusion_situation.vue')
                    },
                    {
                        path: 'index_abnormal',
                        title: '异常流量',
                        name: 'abnormal',
                        component: () => import('@/views/scene-clouddc/global_perspective/abnormal_flow.vue')
                    },
                    {
                        path: 'index_abnormal_scan',
                        title: '异常扫描',
                        name: 'abnormal_scan',
                        component: () => import('@/views/scene-clouddc/global_perspective/abnormal_scanning.vue')
                    },
                    {
                        path: 'index_dns',
                        title: 'DNS监控',
                        name: 'dns',
                        component: () => import('@/views/scene-clouddc/global_perspective/dns_monitoring.vue')
                    }
                ]
            },
            {
                path: '/av_code',
                title: '恶意代码',
                icon: 'icon-guanliyukongzhi',
                name: 'av_code',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '恶意代码',
                        name: 'av',
                        component: () => import('@/views/scene-clouddc/global_perspective/av_code.vue')
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
                title: '内容感知',
                name: 'content_aware',
                icon: 'icon-guanliyukongzhi',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '内容感知',
                        name: 'content',
                        component: () => import('@/views/scene-clouddc/global_perspective/content_aware.vue')
                    }
                ]
            },
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
                    // {
                    //     path: '/traffic',
                    //     title: '应用流量感知',
                    //     name: 'traffic',
                    //
                    //     component: () => import('@/views/scene-clouddc/sa_network/net_east_west_app/net_east_west_app.vue')
                    // }
                ]
            },
        ]
    },
    {
        title: '攻击溯源',
        children: [
          {
            path: '/sa_sec_hacker',
            icon: 'icon-anquanzujian',
            title: '黑客画像',
            name: 'sa_sec_hacker',
            component: Main,
            children: [{
              path: 'sec_hacker',
              title: '黑客画像',
              name: 'sec_hacker',
              component: () => import('@/views/scene-clouddc/intelli_sense/attacksource/sec_hacker.vue')
            }]
          },
          {
            path: '/sa_sec_target',
            icon: 'icon-anquanzujian',
            title: '目标画像',
            name: 'sa_sec_target',
            component: Main,
            children: [{
              path: 'sec_target',
              title: '目标画像',
              name: 'sec_target',
              component: () => import('@/views/scene-clouddc/intelli_sense/attacksource/sec_target.vue')
            }]
          }
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
                path: '/blocking_up',
                title: '安全阻断',
                icon: 'icon-guanliyukongzhi',
                name: 'blocking_up',
                component: Main,
                children: [
                    {
                        path: 'index',
                        title: '安全阻断',
                        name: 'blocking',
                        component: () => import('@/views/scene-clouddc/global_perspective/blocking_up.vue')
                    }
                ]
            }
        ]
    }
];

